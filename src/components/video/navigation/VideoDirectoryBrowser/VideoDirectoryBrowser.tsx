import { useContext, useEffect, useMemo, useState } from "react";
import { VideoDirectory, VideoDirectoryPresentationContext } from "../VideoDirectory/VideoDirectory"
import { useVideoStateAccess } from "../../../features/useVideoStateAccess";
import { directoryPathConcat, getItemFromNode, getSectionType, getRootDirectoryPathFromSubDirectory, IDirectoryNode, IVideoBrowserNode, reformatDirectoryPath, relocateItemToDirectory, VideoDirectoryInteractionContext, getRawSectionFromPrefix, getSectionPrefix, validateDirectoryName, DIRECTORY_NAME_MAX_LENGTH, getSectionPrefixManual, RelocateItemError } from "../directory";
import { useNotificationMessage } from "../../../features/useNotificationMessage";
import { IconContainer } from "../../../images/svgAsset";
import { ReactComponent as ArrowIcon } from "./../../../../../assets/symbols/arrows/arrowhead_sideways.svg"
import { ReactComponent as SettingsIcon } from "./../../../../../assets/icons/settings_icon.svg";
import { ReactComponent as MinimalViewIcon } from "./../../../../../assets/icons/view/minimal_option.svg"
import { ReactComponent as CompactViewIcon } from "./../../../../../assets/icons/view/compact_option.svg"
import { ReactComponent as RegularViewIcon } from "./../../../../../assets/icons/view/regular_option.svg"
import { ReactComponent as HomeIcon } from "./../../../../../assets/icons/home.svg"
import { ReactComponent as LongArrow } from "./../../../../../assets/symbols/arrows/long_arrow.svg"
import { ReactComponent as CategoryDiamond } from "./../../../../../assets/icons/category_diamond.svg"
import { DragEvent, DragList } from "../../../../lib/dragList/DragList";
import { ToggleExpander } from "../../../presentation/ToggleExpander/ToggleExpander";
import { LabelGroup } from "../../../presentation/Decorative/LabelGroup/LabelGroup";
import { IVideoDirectoryBrowserContext, VideoDirectoryBrowserContext } from "./VideoDirectoryBrowserContext";
import { MouseTooltip } from "../../../interactive/MouseTooltip/MouseTooltip";
import { useVideoInfo } from "../../../features/useVideoInfo";
import "./../VideoDirectory/VideoDirectory.css"
import "./VideoDirectoryBrowser.css"

export type VideoPresentationStyle = "MINIMAL" | "COMPACT" | "REGULAR";

export interface IVideoDirectoryBrowserProperties {
	defaultVideoStyle: VideoPresentationStyle;
	directoryPath: string;
	onDirectoryPathChanged: (newPath: string) => void; 
}

export function getDirectoryMoveUserMessage(error: RelocateItemError): string {
	switch (error) {
		case "RENAME_ALREADY_EXISTS":
			return "That name already exists in the target directory."
		case "MOVE_ALREADY_EXISTS":
			return "That directory already exists in the target directory.";
	}
}

function DragDirectoryTooltipItem({ sliceSection }: { sliceSection: string }) {
	return (
		<li className="directory-item">
			<IconContainer className="icon-colour-standard" asset={CategoryDiamond} use-fill/>
			<span>{getRawSectionFromPrefix(sliceSection)}</span>
		</li>
	);
}

function DragVideoTooltipItem({ idSection }: { idSection: string }) {
	const { video } = useVideoInfo(getRawSectionFromPrefix(idSection));

	return (
		<li className="video-item">
			<span>{video?.title}</span>
		</li>
	);
}

export function VideoDirectoryBrowser({ defaultVideoStyle, directoryPath, onDirectoryPathChanged }: IVideoDirectoryBrowserProperties): React.ReactNode {
	const { selectedItems, setSelectedItems, currentlyEditing, setCurrentlyEditing	} = useContext<IVideoDirectoryBrowserContext>(VideoDirectoryBrowserContext);
	const { videoData, root, directoryMove } = useVideoStateAccess();
	const [ lastKnownValidPath, setLastKnownValidPath ] = useState<string>("$");
	const [ isEditingPathManually, setIsEditingPathManually ] = useState<boolean>(false);
	const [ navigationStack, setNavigationStack ] = useState<string[]>([]);
	const { activateMessage } = useNotificationMessage();
	const [ settingsOpen, setSettingsOpen ] = useState<boolean>(false);
	const [ currentViewStyle, setCurrentViewStyle ] = useState<VideoPresentationStyle>(defaultVideoStyle);
	const [ dragging, setDragging ] = useState<DragEvent | null>(null);
	const [ directoryBarHoverPath, setDirectoryBarHoverPath ] = useState<string | null>(null);
	const directory = useMemo<IDirectoryNode | null>(() => {
		if (root == null) {
			return null;
		}

		let node = getItemFromNode(directoryPath, root);

		if (node == null) {
			activateMessage(
				"Node navigation error",
				`Path was not valid, reset to last valid directory ${lastKnownValidPath}. Invalid directory was ${directoryPath}`,
				"Error",
				"Error",
				7000
			);

			return null;
		}

		if (node.type == "VIDEO") {
			activateMessage(
				"Node navigation error",
				`Path was not valid, path was a video, reset to last valid directory ${lastKnownValidPath}. Invalid directory was ${directoryPath}`,
				"Error",
				"Error",
				7000
			);

			return null;
		}

		return node as IDirectoryNode;
	}, [directoryPath, root, videoData]);

	useEffect(() => {
		if (directory == null) {
			onDirectoryPathChanged(lastKnownValidPath);
		}
		else {
			setLastKnownValidPath(directoryPath);
		}

		setSelectedItems([]);
	}, [directory]);

	const requestEditEnd = (newSliceName: string) => {
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
		else {
			let result = directoryMove(directoryPathConcat(directoryPath, getRawSectionFromPrefix(currentlyEditing as string)), directoryPathConcat(directoryPath, newSliceName.trim()));

			if (result != null) {
				let message = getDirectoryMoveUserMessage(result);
				activateMessage(undefined, message, "Error", "Error", 8000, "Shake");
			}
		}

		setCurrentlyEditing(null);
	}

	const dragEnd = () => {
		if (dragging == "NOT_IN_BOUNDS") {
			if (directoryBarHoverPath == null) {
				setDragging(null);
				return;
			}

			for (let i of selectedItems) {	
				let section = getRawSectionFromPrefix(i);
	
				let oldPath = directoryPathConcat(directoryPath, section);
				let newPath = directoryPathConcat(directoryBarHoverPath, section);
	
				directoryMove(oldPath, newPath);
			}

			setSelectedItems([]);
			setDragging(null);
			return;
		}

		let slice = dragging?.overlappingID;

		if (slice == undefined || getSectionType(slice) == "VIDEO") {
			setDragging(null);
			return;
		}

		let targetDirectory = directoryPathConcat(directoryPath, getRawSectionFromPrefix(slice));
		let overlappingTargetSelected = selectedItems.findIndex(x => x == slice);

		// Means that a directory to move to one that is also selected, and you can't move a directory into itself. 
		if (overlappingTargetSelected != -1) {
			setDragging(null);
			return;
		}

		for (let i of selectedItems) {
			if (i == slice) {
				continue;
			}

			let section = getRawSectionFromPrefix(i);

			let oldPath = directoryPathConcat(directoryPath, section);
			let newPath = directoryPathConcat(targetDirectory, section);

			directoryMove(oldPath, newPath);
		}

		setDragging(null);
		setSelectedItems([]);
	}

	const slices = directoryPath.split(">");
	const last = slices[slices.length - 1].trim();

	slices.splice(slices.length - 1, 1);
	let accumulator = "";

	return (
		<>
			<div className="directory-navigator">
				<div className="navigation-buttons">
					<button className="button-base button-small square-button" onClick={() => {
						onDirectoryPathChanged(getRootDirectoryPathFromSubDirectory(directory!.parent!))
						setNavigationStack([ ...navigationStack, directory!.slice ]);
					}} disabled={directory?.parent == null}>
						<IconContainer className="back-arrow icon-colour-standard" asset={LongArrow} use-stroke/>
					</button>
					<button className="button-base button-small square-button" onClick={() => {
						onDirectoryPathChanged("$");
						setNavigationStack([]);
					}}>
						<IconContainer className="icon-colour-standard" asset={HomeIcon} use-stroke use-fill/>
					</button>
					<button className="button-base button-small square-button" onClick={() => {
						let stackRemovedSlice = [ ...navigationStack ];
						let slice: string = stackRemovedSlice.splice(stackRemovedSlice.length - 1, 1)[0];

						onDirectoryPathChanged(directoryPathConcat(directoryPath, slice));
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
								onDirectoryPathChanged(reformatDirectoryPath(e.target.value));
								setNavigationStack([]);
								setIsEditingPathManually(false);
							}}
							onKeyDown={(e) => {
								if (e.key == "Enter") {
									onDirectoryPathChanged(e.currentTarget.value);
									setNavigationStack([]);
								}
							}}
							autoFocus
							defaultValue={directoryPath}/>
						:
						<ul className="directory-path-bar small-text-input directory-navigator-slices" onClick={() => setIsEditingPathManually(true)}>
							{
								slices.map(x => {
									accumulator += x;
									let directPath = accumulator;
									
									accumulator += " > ";
									
									return (
										<li key={directPath}>
											<button className="jump-to-slice-path-button" onClick={(e) => {
												onDirectoryPathChanged(directPath);
												setNavigationStack([]);
												e.stopPropagation();
											}}
											onMouseEnter={() => setDirectoryBarHoverPath(directPath)}
											onMouseLeave={() => setDirectoryBarHoverPath(null)}>{x}</button>
											<IconContainer className="icon-colour-standard" asset={ArrowIcon} use-fill/>
										</li>
									);
								})
							}
							<li>{last}</li>
						</ul>
				}
				<button className="settings-button button-base button-small square-button" onClick={() => setSettingsOpen(!settingsOpen)}>
					<IconContainer className="icon-colour-standard" asset={SettingsIcon} use-stroke use-fill/>
				</button>
			</div>
			<ToggleExpander expanded={settingsOpen}>
				<div className="settings-panel">
					<LabelGroup label="View">
						<div className="view-section">
							<button className="button-base button-small square-button" onClick={() => setCurrentViewStyle("MINIMAL")} data-active-toggle={currentViewStyle == "MINIMAL"}>
								<IconContainer className="icon-colour-standard" asset={MinimalViewIcon} use-stroke use-fill attached-attributes={{ "data-active-toggle": currentViewStyle == "MINIMAL" }}/>
							</button>
							<button className="button-base button-small square-button" onClick={() => setCurrentViewStyle("COMPACT")} data-active-toggle={currentViewStyle == "COMPACT"}>
								<IconContainer className="icon-colour-standard" asset={CompactViewIcon} use-stroke use-fill attached-attributes={{ "data-active-toggle": currentViewStyle == "COMPACT" }}/>
							</button>
							<button className="button-base button-small square-button" onClick={() => setCurrentViewStyle("REGULAR")} data-active-toggle={currentViewStyle == "REGULAR"}>
								<IconContainer className="icon-colour-standard" asset={RegularViewIcon} use-stroke use-fill attached-attributes={{ "data-active-toggle": currentViewStyle == "REGULAR" }}/>
							</button>
						</div>
					</LabelGroup>
				</div>
			</ToggleExpander>
			{/* For dragging */}
			<MouseTooltip show={dragging != null} horizontal="START" vertical="CENTRE">
				<ul className="drag-list-tooltip">
					{
						selectedItems.map(x => getSectionType(x) == "DIRECTORY" ?
							<DragDirectoryTooltipItem key={x} sliceSection={x}/> :
							<DragVideoTooltipItem key={x} idSection={x}/>
						)
					}
				</ul>
			</MouseTooltip>
			{/* Item list */}
			<VideoDirectoryInteractionContext.Provider
				value={{
					navigateRequest: (requester) => {
						onDirectoryPathChanged(getRootDirectoryPathFromSubDirectory(requester));
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
						videoItemStyle: currentViewStyle
					}}>
					<div className="video-directory-list separated-scrollbox">
						<DragList dragListName="directory-dl" onDrag={(e) => {
							setDragging(e);

							if (selectedItems.length == 0 && e != "NOT_IN_BOUNDS") {
								setSelectedItems([ e.startDragID ]);
							}
						}}
						onDragEnd={dragEnd}
						>
							{directory != null ? <VideoDirectory directoryData={directory}/> : <p>No directory</p>}
						</DragList>
						<div className="empty-click-area" onClick={() => setSelectedItems([])}/>
					</div>
				</VideoDirectoryPresentationContext.Provider>
			</VideoDirectoryInteractionContext.Provider>
		</>
	)
}
