/// <reference types="vite-plugin-svgr/client" />

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { VideoDirectory, VideoDirectoryPresentationContext } from "../VideoDirectory/VideoDirectory"
import { useNotificationMessage } from "../../../features/notifications/useNotificationMessage";
import { IconContainer } from "../../../images/svgAsset";
import ArrowIcon from "./../../../../../assets/symbols/arrows/arrowhead_sideways.svg?react"
import SettingsIcon from "./../../../../../assets/icons/settings_icon.svg?react";
import MinimalViewIcon from "./../../../../../assets/icons/view/minimal_option.svg?react"
import CompactViewIcon from "./../../../../../assets/icons/view/compact_option.svg?react"
import RegularViewIcon from "./../../../../../assets/icons/view/regular_option.svg?react"
import HomeIcon from "./../../../../../assets/icons/home.svg?react"
import LongArrow from "./../../../../../assets/symbols/arrows/long_arrow.svg?react"
import CategoryDiamond from "./../../../../../assets/icons/category_diamond.svg?react"
import { DragEvent, DragList } from "../../../../lib/dragList/DragList";
import { ToggleExpander } from "../../../presentation/ToggleExpander/ToggleExpander";
import { LabelGroup } from "../../../presentation/Decorative/LabelGroup/LabelGroup";
import { IVideoDirectoryBrowserContext, VideoDirectoryBrowserContext } from "./VideoDirectoryBrowserContext";
import { MouseTooltip } from "../../../interactive/MouseTooltip/MouseTooltip";
import { useVideoInfo } from "../../../features/useVideoInfo";
import { SelectionList } from "../../../interactive/SelectionDragList/SelectionDragList";
import { tempStateActions } from "../../../../features/state/tempStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import "./../VideoDirectory/VideoDirectory.css"
import "./VideoDirectoryBrowser.css"
import { DIRECTORY_NAME_MAX_LENGTH, getNodeFromPath, getNodeFromRef, getNodeSection, getNodeType, getPathOfNode, NodeRef } from "../../../../lib/directory/directory";
import { directoryPathConcat, getParentPathFromPath, NodePath, parsePath, pathToString, reformatDirectoryPath, validateDirectoryName } from "../../../../lib/directory/path";
import { directoryActions } from "../../../../features/directory/directorySlice";
import { VideoDirectoryInteractionContext } from "../../../../context/directory";
import { VideoPresentationStyle } from "../../../../lib/storage/tempState/layoutState";

export interface IVideoDirectoryBrowserProperties {
	defaultVideoStyle: VideoPresentationStyle;
	directoryPath: NodePath;
	onDirectoryPathChanged: (newPath: NodePath) => void; 
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

export function VideoDirectoryBrowser({ directoryPath, onDirectoryPathChanged }: IVideoDirectoryBrowserProperties): React.ReactNode {
	const { selectedItems, setSelectedItems, currentlyEditing, setCurrentlyEditing	} = useContext<IVideoDirectoryBrowserContext>(VideoDirectoryBrowserContext);
	const [ lastKnownValidPath, setLastKnownValidPath ] = useState<NodePath>(parsePath("$"));
	const [ isEditingPathManually, setIsEditingPathManually ] = useState<boolean>(false);
	const [ navigationStack, setNavigationStack ] = useState<string[]>([]);
	const { activateMessage } = useNotificationMessage();
	const [ isDragging, setIsDragging ] = useState<boolean>(false);
	const [ dragging, setDragging ] = useState<DragEvent<NodeRef> | null>(null);
	const [ directoryBarHoverPath, setDirectoryBarHoverPath ] = useState<NodePath | null>(null);
	const [ timestampActivelyDragging, setTimestampActivelyDragging ] = useState<boolean>(false);
	const dispatch = useDispatch();
	const layout = useSelector((state: RootState) => state.tempState.layout);
	const scrollPosition = useSelector((state: RootState) => state.tempState.videoBrowserScrollDistance);
	const tree = useSelector((state: RootState) => state.directory.videoBrowser);
	const videoCache = useSelector((state: RootState) => state.cache.videoCache);
	const directory = useMemo(() => {
		let nodeID = getNodeFromPath(tree, directoryPath);

		if (nodeID == null) {
			return tree.directoryNodes[tree.rootNode];
		}

		return tree.directoryNodes[nodeID];
	}, [directoryPath]);

	useEffect(() => {
		if (directory == null) {
			onDirectoryPathChanged(lastKnownValidPath);
		}
		else {
			setLastKnownValidPath(directoryPath);
		}

		setSelectedItems([]);
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

		if (dragging == "NOT_IN_BOUNDS") {
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

		if (dragging?.overlappingID == undefined || getNodeType(tree, dragging.overlappingID as NodeRef) == "VIDEO") {
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

	let parentSlices = getParentPathFromPath(directoryPath).slices;

	let accumulator = "";

	return (
		<>
			<div className="directory-navigator">
				<div className="navigation-buttons">
					<button className="button-base button-small square-button" onClick={() => {
						onDirectoryPathChanged(getParentPathFromPath(directoryPath));
						setNavigationStack([ ...navigationStack, directory!.slice ]);
					}} disabled={directoryPath.slices[0] == "$"}>
						<IconContainer className="back-arrow icon-colour-standard" asset={LongArrow} use-stroke/>
					</button>
					<button className="button-base button-small square-button" onClick={() => {
						onDirectoryPathChanged(parsePath("$"));
						setNavigationStack([]);
					}}>
						<IconContainer className="icon-colour-standard" asset={HomeIcon} use-stroke use-fill/>
					</button>
					<button className="button-base button-small square-button" onClick={() => {
						let stackRemovedSlice = [ ...navigationStack ];
						let slice: string = stackRemovedSlice.splice(stackRemovedSlice.length - 1, 1)[0];

						onDirectoryPathChanged(directoryPathConcat(directoryPath, slice, "DIRECTORY"));
						setNavigationStack(stackRemovedSlice);
					}} disabled={navigationStack.length == 0}>
						<IconContainer className="icon-colour-standard" asset={LongArrow} use-stroke/>
					</button>
				</div>
				{
					isEditingPathManually ?
						<input
							className="directory-path-bar small-text-input"
							onBlur={(e) => {
								onDirectoryPathChanged(parsePath(e.target.value));
								setNavigationStack([]);
								setIsEditingPathManually(false);
							}}
							onKeyDown={(e) => {
								if (e.key == "Enter") {
									onDirectoryPathChanged(parsePath(e.currentTarget.value));
									setNavigationStack([]);
									setIsEditingPathManually(false);
								}
							}}
							autoFocus
							defaultValue={pathToString(directoryPath)}/>
						:
						<ul className="directory-path-bar small-text-input directory-navigator-slices" onClick={() => setIsEditingPathManually(true)}>
							{
								parentSlices.map(x => {
									accumulator += x;
									let directPath = accumulator;
									
									accumulator += " > ";
									
									return (
										<li key={directPath}>
											<button className="jump-to-slice-path-button" onClick={(e) => {
												onDirectoryPathChanged(parsePath(directPath));
												setNavigationStack([]);
												e.stopPropagation();
											}}
											onMouseEnter={() => setDirectoryBarHoverPath(parsePath(directPath))}
											onMouseLeave={() => setDirectoryBarHoverPath(null)}>{x}</button>
											<IconContainer className="icon-colour-standard" asset={ArrowIcon} use-fill/>
										</li>
									);
								})
							}
							<li>{directoryPath.slices[directoryPath.slices.length - 1]}</li>
						</ul>
				}
				<button className="settings-button button-base button-small square-button" onClick={() => dispatch(tempStateActions.setLayoutState({ ...layout, isDirectoryBrowserSettingsExpanded: !layout.isDirectoryBrowserSettingsExpanded }))}>
					<IconContainer className="icon-colour-standard" asset={SettingsIcon} use-stroke use-fill/>
				</button>
			</div>
			<ToggleExpander expanded={layout.isDirectoryBrowserSettingsExpanded}>
				<div className="settings-panel">
					<LabelGroup label="View">
						<div className="view-section">
							<button className="button-base button-small square-button" onClick={() => dispatch(tempStateActions.changeVideoViewStyle("MINIMAL"))} data-active-toggle={layout.videoItemViewStyle == "MINIMAL"}>
								<IconContainer className="icon-colour-standard" asset={MinimalViewIcon} use-stroke use-fill attached-attributes={{ "data-active-toggle": layout.videoItemViewStyle == "MINIMAL" }}/>
							</button>
							<button className="button-base button-small square-button" onClick={() => dispatch(tempStateActions.changeVideoViewStyle("COMPACT"))} data-active-toggle={layout.videoItemViewStyle == "COMPACT"}>
								<IconContainer className="icon-colour-standard" asset={CompactViewIcon} use-stroke use-fill attached-attributes={{ "data-active-toggle": layout.videoItemViewStyle == "COMPACT" }}/>
							</button>
							<button className="button-base button-small square-button" onClick={() => dispatch(tempStateActions.changeVideoViewStyle("REGULAR"))} data-active-toggle={layout.videoItemViewStyle == "REGULAR"}>
								<IconContainer className="icon-colour-standard" asset={RegularViewIcon} use-stroke use-fill attached-attributes={{ "data-active-toggle": layout.videoItemViewStyle == "REGULAR" }}/>
							</button>
						</div>
					</LabelGroup>
				</div>
			</ToggleExpander>
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
							setNavigationStack([]);
						},
						selectedItems,
						setSelectedItems,
						currentlyEditing,
						requestEditEnd,
						draggingID: dragging != "NOT_IN_BOUNDS" ? dragging?.overlappingID ?? null : null
					}}>
					<VideoDirectoryPresentationContext.Provider
						value={{
							videoItemStyle: layout.videoItemViewStyle
						}}>
							<SelectionList
								className="video-directory-list separated-scrollbox"
								itemIDName="directory-dl"
								boxClassName="video-selection-box"
								allowSelection={!isDragging}
								setSelectedItems={setSelectedItems}
								startingScrollPosition={scrollPosition}
								onScroll={(e) => dispatch(tempStateActions.setVideoBrowserScrollDistance(e.currentTarget.scrollTop))}>
									<DragList<NodeRef> className="directory-drag-list" dragListName="directory-dl" onDragStart={() => setIsDragging(true)} onDrag={(e) => {
										setDragging(e);

										if (selectedItems.length == 0 && e != "NOT_IN_BOUNDS") {
											setSelectedItems([ e.startDragID ]);
										}
									}} onDragEnd={() => setTimeout(dragEnd, 10)}>
										{directory != null ? <VideoDirectory directoryData={directory}/> : <p>No directory</p>}
										<div className="empty-click-area" onClick={() => setSelectedItems([])}/>
									</DragList>
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
