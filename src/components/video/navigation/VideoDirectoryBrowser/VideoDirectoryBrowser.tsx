/// <reference types="vite-plugin-svgr/client" />

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { VideoDirectory, VideoDirectoryPresentationContext } from "../VideoDirectory/VideoDirectory"
import { useNotificationMessage } from "../../../features/notifications/useNotificationMessage";
import { IconContainer } from "../../../images/svgAsset";
import CategoryDiamond from "./../../../../../assets/icons/category_diamond.svg?react"
import { DragListEvent, DragList } from "../../../../lib/dragList/DragList";
import { IVideoDirectoryBrowserContext, VideoDirectoryBrowserContext } from "./VideoDirectoryBrowserContext";
import { MouseTooltip } from "../../../interactive/MouseTooltip/MouseTooltip";
import { useVideoInfo } from "../../../features/useVideoInfo";
import { SelectionList } from "../../../interactive/SelectionDragList/SelectionDragList";
import { tempStateActions } from "../../../../features/state/tempStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import "./../VideoDirectory/VideoDirectory.css"
import "./VideoDirectoryBrowser.css"
import { DIRECTORY_NAME_MAX_LENGTH, getNodeFromRef, getNodeSection, getNodeType, getPathOfNode, NodeRef } from "../../../../lib/directory/directory";
import { directoryPathConcat, getParentPathFromPath, NodePath, parsePath, validateDirectoryName } from "../../../../lib/directory/path";
import { directoryActions } from "../../../../features/directory/directorySlice";
import { VideoDirectoryInteractionContext } from "../../../../context/directory";
import { VideoPresentationStyle } from "../../../../lib/storage/tempState/layoutState";
import { useDirectory } from "../useDirectory";
import { useHotkeys } from "react-hotkeys-hook";
import { getYouTubeLinkFromVideoID } from "../../../../lib/util/youtube/youtubeUtil";
import { videoActions } from "../../../../features/video/videoSlice";
import { ActionMessageDialog } from "../../../dialogs/ActionDialogMessage";

export interface IVideoDirectoryBrowserProperties {
	defaultVideoStyle: VideoPresentationStyle;
	directoryPath: NodePath;
	directoryBarHoverPath: NodePath | null;
	onDirectoryPathChanged: (newPath: NodePath) => void;
	onNavigate: (stack: string[]) => void;
}

function DragDirectoryTooltipItem({ sliceSection }: { sliceSection: string }) {
	return (
		<li className="directory-item">
			<IconContainer className="icon-colour-standard" asset={CategoryDiamond} use-fill/>
			<span>{sliceSection}</span>
		</li>
	);
}

function DragVideoTooltipItem({ videoID }: { videoID: string }) {
	const { video } = useVideoInfo(videoID);

	return (
		<li className="video-item">
			<span>{video?.title}</span>
		</li>
	);
}

export function VideoDirectoryBrowser({ directoryPath, directoryBarHoverPath, onDirectoryPathChanged, onNavigate }: IVideoDirectoryBrowserProperties): React.ReactNode {
	const { selectedItems, setSelectedItems, currentlyEditing, setCurrentlyEditing	} = useContext<IVideoDirectoryBrowserContext>(VideoDirectoryBrowserContext);
	const [ lastKnownValidPath, setLastKnownValidPath ] = useState<NodePath>(parsePath("$"));
	const [ isDragging, setIsDragging ] = useState<boolean>(false);
	const [ dragging, setDragging ] = useState<DragListEvent<NodeRef> | null>(null);
	const [ timestampActivelyDragging, setTimestampActivelyDragging ] = useState<boolean>(false);
	const [ deleteNodeDialog, setDeleteNodeDialog ] = useState<NodeRef | null>(null); 
	const { activateMessage } = useNotificationMessage();
	const dispatch = useDispatch();
	const layout = useSelector((state: RootState) => state.tempState.layout);
	const expandedVideoIDs = useSelector((state: RootState) => state.tempState.expandedVideoIDs);
	const scrollPosition = useSelector((state: RootState) => state.tempState.videoBrowserScrollDistance);
	const tree = useSelector((state: RootState) => state.directory.videoBrowser);
	const videoCache = useSelector((state: RootState) => state.cache.videoCache);
	const directory = useDirectory(directoryPath);
	const listRef = useRef<HTMLDivElement>(null!);
	
	useHotkeys("ArrowUp", (e) => {
		if (selectedItems.length != 1 || !listRef.current.contains(document.activeElement)) {
			return;
		}

		// Stops scrolling when navigating items using arrow keys (nodes are autofocused).
		e.preventDefault();
		
		let index = directory.subNodes.findIndex(n => selectedItems[0] == n);
		let newNode = index == 0 ? directory.subNodes[directory.subNodes.length - 1] : directory.subNodes[index - 1];
		
		setSelectedItems([ newNode ]);
	});

	useHotkeys("ArrowDown", (e) => {
		if (selectedItems.length != 1 || !listRef.current.contains(document.activeElement)) {
			return;
		}

		e.preventDefault();
		
		let index = directory.subNodes.findIndex(n => selectedItems[0] == n);
		let newNode = index == directory.subNodes.length - 1 ? directory.subNodes[0] : directory.subNodes[index + 1];
		
		setSelectedItems([ newNode ]);
	});

	useHotkeys("Enter, ArrowRight", (e) => {
		if (selectedItems.length != 1 || !listRef.current.contains(document.activeElement)) {
			return;
		}

		if (getNodeType(tree, selectedItems[0]) == "DIRECTORY") {
			let node = selectedItems[0];

			onDirectoryPathChanged(directoryPathConcat(directoryPath, tree.directoryNodes[node].slice, "DIRECTORY"));
		}
		else {
			let videoID = tree.videoNodes[selectedItems[0]].videoID;

			if (e.key == "Enter") {
				window.open(getYouTubeLinkFromVideoID(videoID));
			}
			else if (expandedVideoIDs.includes(videoID)) {
				dispatch(tempStateActions.collapseVideo(videoID));
			}
			else {
				dispatch(tempStateActions.expandVideo(videoID));
			}
		}
	});

	useHotkeys("Backspace, ArrowLeft", () => {
		if (directory.slice == "$") {
			return;
		}

		onDirectoryPathChanged(getParentPathFromPath(directoryPath));
		setSelectedItems([ directory.nodeID ]);
	});

	useHotkeys("Ctrl + A", (e) => {
		if (document.querySelector(".video-directory-browser-list:focus-within") != null) {
			e.preventDefault();

			setSelectedItems([ ...directory.subNodes ]);
		}
	})

	useEffect(() => {
		if (directory == null) {
			onDirectoryPathChanged(lastKnownValidPath);
		}
		else {
			setLastKnownValidPath(directoryPath);
		}

		setSelectedItems(selectedItems.filter(n => directory.subNodes.findIndex(s => s == n) != -1));
	}, [directory]);

	const requestEditEnd = async (newSliceName: string) => {
		let result = validateDirectoryName(newSliceName);

		if (result != null && result != "STARTS_ENDS_IN_WHITESPACE") {
			let message = "";

			switch (result) {
				case "EMPTY":
					message = "Names must contain at least one character.";
					break;
				case "INVALID_CHARACTERS":
					message = `"${newSliceName}" contains an invalid character.`;
					break;
				case "TOO_LONG":
					message = `That name is too long, names cannot exceed ${DIRECTORY_NAME_MAX_LENGTH} characters.`;
					break;
				case "WHITESPACE_ONLY":
					message = "Names must contain at least one valid character.";
			}

			activateMessage(
				"Unable to rename the directory.",
				message,
				"Warning",
				"Warning",
				5000,
				"Shake"
			);
		}

		dispatch(directoryActions.renameDirectory({
			targetPath: directoryPathConcat(directoryPath, tree.directoryNodes[currentlyEditing as NodeRef].slice, "DIRECTORY"),
			newSlice: newSliceName
		}));

		setCurrentlyEditing(null);
	}

	const dragEnd = () => {
		setIsDragging(false);

		if (dragging == null || timestampActivelyDragging) {
			setDragging(null);
			return;
		}

		if (dragging.notInBounds) {
			if (directoryBarHoverPath == null) {
				setDragging(null);
				return;
			}

			for (let i of selectedItems) {
				let node = getNodeFromRef(tree, i);
				let section = getNodeSection(tree, node);
				let type = getNodeType(tree, i);
		
				let oldPath = directoryPathConcat(directoryPath, section, type)
	
				dispatch(directoryActions.moveNode({
					targetPath: oldPath,
					destinationPath: directoryBarHoverPath,
					videoData: videoCache
				}));
			}

			setSelectedItems([]);
			setDragging(null);
			return;
		}

		if (dragging.overlappingID == null || getNodeType(tree, dragging.overlappingID) == "VIDEO") {
			setDragging(null);
			return;
		}

		let targetDirectory = directoryPathConcat(directoryPath, getNodeSection(tree, getNodeFromRef(tree, dragging.overlappingID)), getNodeType(tree, dragging.overlappingID));
		let overlappingTargetSelected = selectedItems.findIndex(x => x == dragging.overlappingID);

		// Means that a directory to move to one that is also selected, and you can't move a directory into itself. 
		if (overlappingTargetSelected != -1) {
			setDragging(null);
			return;
		}

		for (let i of selectedItems) {
			if (i == dragging.overlappingID) {
				continue;
			}

			let section = getNodeSection(tree, getNodeFromRef(tree, i));
			let type = getNodeType(tree, i);

			let oldPath = directoryPathConcat(directoryPath, section, type);

			dispatch(directoryActions.moveNode({
				targetPath: oldPath,
				destinationPath: targetDirectory,
				videoData: videoCache
			}));
		}

		setDragging(null);
		setSelectedItems([]);
	}

	return (
		<>	
			{deleteNodeDialog != null ?
				<ActionMessageDialog
					title="Delete this item?"
					body={`Are you sure you want to delete this ${getNodeType(tree, deleteNodeDialog).toLowerCase()}?`}
					buttons={["Yes", "Cancel"]}
					defaultFocusedButton="Cancel"
					defaultMessage="Cancel"
					overrideOpen={deleteNodeDialog != null}
					onButtonPressed={(result) => {
						if (result == "Yes") {
							let nodeType = getNodeType(tree, deleteNodeDialog);
							let path = directoryPathConcat(directoryPath, getNodeSection(tree, getNodeFromRef(tree, deleteNodeDialog)), nodeType);

							if (nodeType == "VIDEO") {
								dispatch(videoActions.removeVideos([ tree.videoNodes[deleteNodeDialog].videoID ]));
							}

							dispatch(directoryActions.removeNodes([ path ]));

							let selected = selectedItems.filter(n => n != deleteNodeDialog);
							setSelectedItems(selected);
						}

						setDeleteNodeDialog(null);
					}}/>
					:
					<></>
			}
			{/* For dragging */}
			<MouseTooltip show={dragging != null && !timestampActivelyDragging} horizontal="START" vertical="CENTRE">
				<ul className="drag-list-tooltip">
					{
						selectedItems.filter(x => x != null).map(x => getNodeType(tree, x) == "DIRECTORY" ?
							<DragDirectoryTooltipItem key={x} sliceSection={getNodeSection(tree, getNodeFromRef(tree, x))}/> :
							<DragVideoTooltipItem key={x} videoID={getNodeSection(tree, getNodeFromRef(tree, x))}/>
						)
					}
				</ul>
			</MouseTooltip>
			{/* Item list */}
			<TimestampListStateContext.Provider value={{
					activelyDragging: timestampActivelyDragging, 
					setActivelyDragging: setTimestampActivelyDragging 
				}}>
				<VideoDirectoryInteractionContext.Provider
					value={{
						navigateRequest: (requester) => {
							onDirectoryPathChanged(getPathOfNode(tree, requester.nodeID) as NodePath);
							onNavigate([]);
						},
						selectedItems,
						setSelectedItems,
						currentlyEditing,
						requestEditEnd,
						activateDeleteNodeDialog: setDeleteNodeDialog,
						draggingID: !dragging?.notInBounds ? dragging?.overlappingID ?? null : null
					}}>
					<VideoDirectoryPresentationContext.Provider
						value={{
							videoItemStyle: layout.videoItemViewStyle
						}}>
							<SelectionList
								className="video-directory-browser-list separated-scrollbox"
								itemIDName="directory-dl"
								boxClassName="video-selection-box"
								innerClassName="list-data-wrapper"
								allowSelection={!isDragging}
								selectedItems={selectedItems}
								setSelectedItems={setSelectedItems}
								startingScrollPosition={scrollPosition}
								ref={listRef}
								onScroll={(e) => dispatch(tempStateActions.setVideoBrowserScrollDistance(e.currentTarget.scrollTop))}>
									<>
										<DragList<NodeRef>	
											className="directory-drag-list"
											dragListName="directory-dl"
											onDragStart={() => setIsDragging(true)}
											onDragEnd={dragEnd}
											onDragChanged={(e) => {
												setDragging(e);

												if (selectedItems.length == 0 && !e.notInBounds) {
													setSelectedItems([ e.startDragID ]);
												}
											}}>
												{directory != null ? <VideoDirectory directoryData={directory}/> : <p>No directory</p>}
										</DragList>
										<div className="empty-click-area" onClick={() => setSelectedItems([])}/>
									</>
							</SelectionList>
					</VideoDirectoryPresentationContext.Provider>
				</VideoDirectoryInteractionContext.Provider>
			</TimestampListStateContext.Provider>
		</>
	)
}

export interface ITimestampListStateContext {
	activelyDragging: boolean;
	setActivelyDragging: (isDragging: boolean) => void;
}

export const TimestampListStateContext = createContext<ITimestampListStateContext>({
	activelyDragging: false,
	setActivelyDragging: () => console.error("TimestampListStateContext.setActivelyDragging: No context provided.")
});
