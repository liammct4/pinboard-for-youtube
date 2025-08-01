/// <reference types="vite-plugin-svgr/client" />

import { useMemo, useState } from "react";
import { ActionMessageDialog } from "../../components/dialogs/ActionDialogMessage.tsx";
import { FormDialog } from "../../components/dialogs/FormDialog.tsx";
import { SplitHeading } from "../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading.tsx";
import { VideoCard } from "../../components/video/VideoCard/VideoCard.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store.ts";
import { IconContainer } from "../../components/images/svgAsset.tsx";
import { TwoToggleLayoutExpander } from "../../components/presentation/TwoToggleLayoutExpander/TwoToggleLayoutExpander.tsx";
import OpenLayoutIcon from "./../../../assets/icons/layout_expander_open.svg?react"
import CloseLayoutIcon from "./../../../assets/icons/layout_expander_close.svg?react"
import SearchIcon from "./../../../assets/symbols/search.svg?react"
import { Spinner } from "../../components/presentation/Decorative/Spinner/Spinner.tsx";
import { getVideoIdFromYouTubeLink, IYoutubeVideoInfo } from "../../lib/util/youtube/youtubeUtil.ts";
import { VideoDirectoryBrowser } from "../../components/video/navigation/VideoDirectoryBrowser/VideoDirectoryBrowser.tsx";
import { VideoDirectoryBrowserContext } from "../../components/video/navigation/VideoDirectoryBrowser/VideoDirectoryBrowserContext.ts";
import { LabelGroup } from "../../components/presentation/Decorative/LabelGroup/LabelGroup.tsx";
import { getActiveVideoInfo } from "../../lib/browser/youtube.ts";
import { generateTimestamp, IVideo } from "../../lib/video/video.ts";
import CrossIcon from "./../../../assets/symbols/cross.svg?react"
import "./../../styling/dialog.css"
import "./VideosPage.css"
import { videoActions } from "../../features/video/videoSlice.ts";
import { directoryActions } from "../../features/directory/directorySlice.ts";
import { useVideoCache } from "../../components/features/useVideoInfo.ts";
import { DIRECTORY_NAME_MAX_LENGTH, getNodeFromPath, getNodeFromVideoID, getNodeType, getPathOfNode, NodeRef } from "../../lib/directory/directory.ts";
import { NodePath, parsePath, pathToString, validateDirectoryName } from "../../lib/directory/path.ts";
import { tempStateActions } from "../../features/state/tempStateSlice.ts";
import { TextInput } from "../../components/input/TextInput/TextInput.tsx";
import { VideoDirectoryControls } from "../../components/video/navigation/VideoDirectoryControls/VideoDirectoryControls.tsx";
import { useDirectoryPath } from "../../components/video/navigation/useDirectory.ts";
import { ValidatedForm, ValidatorResult } from "../../components/forms/ValidatedForm.tsx";
import { VideoSearchItem } from "../../components/video/VideoSearchItem/VideoSearchItem.tsx";
import { SwitchInputPrimitive } from "../../components/input/SwitchInput/SwitchInput.tsx";
import { SmallButton } from "../../components/interactive/buttons/SmallButton/SmallButton.tsx";
import { ButtonPanel } from "../../components/interactive/ButtonPanel/ButtonPanel.tsx";
import { useDialogPausedHotkeys } from "../../components/dialogs/useDialogPausedHotkeys.ts";

type AddVideoFormFields = "link";
type AddVideoForm = {
	link: string;
}

type AddDirectoryFormFields = "directoryName";
type AddDirectoryForm = {
	directoryName: string;
}

type SearchBarFormFields = "searchTerm";
type SearchBarForm = {
	searchTerm: string;
}

export function VideosPage(): React.ReactNode {
	const dispatch = useDispatch();
	const directoryPath = useSelector((state: RootState) => state.tempState.currentDirectory);
	const [ selectedItems, setSelectedItems ] = useState<NodeRef[]>([]);
	const [ currentlyEditing, setCurrentlyEditing ] = useState<NodeRef | null>(null);
	const [ deleteConfirmationOpen, setDeleteConfirmationOpen ] = useState<boolean>(false);
	const [ navigationStack, setNavigationStack ] = useState<string[]>([]);
	const [ directoryBarHoverPath, setDirectoryBarHoverPath ] = useState<NodePath | null>(null);
	const [ searchTerm, setSearchTerm ] = useState<string | null>(null);
	const [ includeTitles, setIncludeTitles ] = useState<boolean>(true);
	const [ includeTimestamps, setIncludeTimestamps ] = useState<boolean>(true);
	const [ focusSearch, setFocusSearch ] = useState<boolean>(false);
	const temporarySingleState = useSelector((state: RootState) => state.tempState.temporarySingleState);
	const layoutState = useSelector((state: RootState) => state.tempState.layout);
	const activeVideoID = useSelector((state: RootState) => state.video.activeVideoID);
	const videos = useSelector((state: RootState) => state.video.videos);
	const { retrieveInfo } = useVideoCache();
	const videoCache = useSelector((state: RootState) => state.cache.videoCache);
	const tree = useSelector((state: RootState) => state.directory.videoBrowser);
	const directory = useDirectoryPath(directoryPath);
	const searchLower = useMemo(() => (searchTerm ?? "").toLowerCase().trim(), [searchTerm]);

	// Hotkeys for directory browser.
	useDialogPausedHotkeys("delete", () => setDeleteConfirmationOpen(selectedItems.length > 0));
	useDialogPausedHotkeys("F2", () => {
		if (selectedItems.length == 1) {
			setCurrentlyEditing(selectedItems[0]);
		}
	});

	let addVideoFormHandler = async (data: AddVideoForm) => {
		let id = getVideoIdFromYouTubeLink(data.link);

		if (!id.success) {
			console.error(`addVideoFormHandler: ${id.reason}`);
			return;
		}

		let info = await retrieveInfo(id.result);

		dispatch(videoActions.addVideo({
			id: id.result,
			timestamps: [],
			autoplayTimestamp: null
		}));

		dispatch(directoryActions.createVideoNode({
			parentPath: directoryPath,
			videoID: id.result,
			videoData: [ ...videoCache, info as IYoutubeVideoInfo ]
		}));
	};
	let addDirectoryFormHandler = (data: AddDirectoryForm) => dispatch(
		directoryActions.createDirectoryNode({
			parentPath: directoryPath,
			slice: data.directoryName
		})
	)

	const onSaveActiveVideo = async () => {
		if (activeVideoID == undefined) {
			return;
		}

		let info = await retrieveInfo(activeVideoID) as IYoutubeVideoInfo;

		dispatch(videoActions.addVideo({ id: activeVideoID, timestamps: [], autoplayTimestamp: null }));
		dispatch(directoryActions.createVideoNode({
			parentPath: directoryPath,
			videoID: activeVideoID,
			videoData: [ ...videoCache, info ]
		}));
	};
	const onPinCurrentTimestamp = async () => {
		const activeVideo = await getActiveVideoInfo();

		if (activeVideo == null || !videos[activeVideo.id] == undefined) {
			return;
		}

		let video = videos[activeVideo.id] as IVideo;
		
		let newActiveVideo: IVideo = {
			...video,
			id: activeVideo.id,
			timestamps: [
				...video.timestamps,
				generateTimestamp(Math.floor(activeVideo!.currentTime), "Current time")
			]
		}
		
		dispatch(videoActions.addOrReplaceVideo(newActiveVideo));
	};
	const clearEverything = (action: string) => {
		if (action == "I understand, remove everything") {
			dispatch(directoryActions.removeNodes([ "$" ]));
			dispatch(tempStateActions.setDirectoryPath("$"));
			dispatch(videoActions.clearVideos());
			setSelectedItems([]);
		}
	};

	const setDirectoryPath = (newPath: NodePath) => dispatch(tempStateActions.setDirectoryPath(pathToString(newPath)));
	
	const searchFilter = (v: IVideo) => {
		let title = videoCache.find(x => x.video_id == v?.id)?.title;

		if (title == undefined || searchTerm == undefined) {
			return false;
		}

		if (includeTitles && title.toLowerCase().includes(searchLower)) {
			return true;
		}

		if (includeTimestamps) {
			for (let timestamp of v.timestamps) {
				if (timestamp.message.toLowerCase().includes(searchLower)) {
					return true;
				}
			}
		}

		return false;
	}

	return (
		<div className="video-page-outer">
			{/* Delete selected sections confirmation dialog */}
			<ActionMessageDialog
				buttons={["Yes", "Cancel"]}
				defaultFocusedButton="Cancel"
				defaultMessage="Cancel"
				title="Delete selected items"
				onButtonPressed={(action) => {
					if (action == "Yes") {
						dispatch(directoryActions.removeNodes(selectedItems.map(x => getPathOfNode(tree, x) as NodePath)));
						dispatch(videoActions.removeVideos(selectedItems.filter(x => getNodeType(tree, x) == "VIDEO").map(x => tree.videoNodes[x].videoID)));
					}

					setSelectedItems([]);
					setDeleteConfirmationOpen(false);
				}}
				body="Are you sure you want to delete all the selected items, this action cannot be undone."
				overrideOpen={deleteConfirmationOpen}/>
			{temporarySingleState.onRequestIsVideoControlLocked ?
				<div className="lock-spinner-outer">
					<Spinner className="lock-spinner" text="Fetching account data"/>
				</div>
				: <></>
			}
			<div className="video-page-inner scrollbar-big" data-locked={temporarySingleState.onRequestIsVideoControlLocked}>
				<TwoToggleLayoutExpander
					className="top-heading-row"
					expanded={layoutState.isCurrentVideosSectionExpanded}
					onExpandedEvent={(value: boolean) =>
						dispatch(tempStateActions.setLayoutState({ ...layoutState, isCurrentVideosSectionExpanded: value }))
					}
					openButtonContent={<IconContainer asset={OpenLayoutIcon} className="icon-colour-standard" use-stroke use-fill/>}
					closeButtonContent={<IconContainer asset={CloseLayoutIcon} className="icon-colour-standard" use-stroke use-fill/>}
					openTooltip="Show current video controls and saved timestamps."
					closeTooltip="Only show saved timestamps."
					align="right"
					content={<SplitHeading className="current-video-heading" text="Current Video"/>}>
						{/* Current video */}
						<VideoCard className="current-video-card" videoID={activeVideoID ?? undefined} placeholderTitle="No video found!"/>
						{/* Current video controls */}
						<ButtonPanel className="current-video-buttons">
							<SmallButton onClick={onSaveActiveVideo} disabled={activeVideoID == null || getNodeFromVideoID(tree, activeVideoID) != null} title="Save this video to the current directory.">Save video</SmallButton>
							<SmallButton onClick={onPinCurrentTimestamp} disabled={activeVideoID == null || getNodeFromVideoID(tree, activeVideoID) == null} title="Save the current time of the playing video as a new timestamp.">Pin timestamp</SmallButton>
						</ButtonPanel>
				</TwoToggleLayoutExpander>
				{/* My timestamps */}
				<SplitHeading className="video-collection-section-heading" text={searchTerm == null ? "My Video Timestamps" : "Search Results"}></SplitHeading>
				<div className="video-navigation-panel">
					{/* Search bar. */}
					<ValidatedForm<SearchBarForm, SearchBarFormFields>
						className="search-bar-form"
						name="search-bar-form"
						onSuccess={(data) => setSearchTerm(data.searchTerm.trim() != "" ? data.searchTerm.trim() : null )}>
						<div className="search-bar-wrapper small-text-input" data-force-focus={focusSearch}>
							<input
								name="searchTerm"
								defaultValue={searchTerm ?? ""}
								onBlur={() => setFocusSearch(false)}
								onFocus={() => setFocusSearch(true)}/>
							{
								searchTerm != null ?
								<button onClick={() => setSearchTerm(null)} title="Clear the current search.">
									<IconContainer className="icon-colour-standard" asset={CrossIcon} use-stroke/>
								</button>
								: <></>
							}
						</div>
						<SmallButton circle type="submit" title="Search through all saved videos with keywords.">
							<IconContainer
								asset={SearchIcon}
								className="icon-colour-standard"
								use-stroke/>
						</SmallButton>
					</ValidatedForm>
				</div>
				{
					searchTerm == null ?
						<>
							<VideoDirectoryControls
								navigationStack={navigationStack}
								onNavigate={setNavigationStack}
								path={directory}
								onDirectoryPathChanged={setDirectoryPath}
								setDirectoryBarHoverPath={setDirectoryBarHoverPath}/>
							<VideoDirectoryBrowserContext.Provider
								value={{
									selectedItems,
									setSelectedItems,
									currentlyEditing,
									setCurrentlyEditing
								}}>
								<VideoDirectoryBrowser
									defaultVideoStyle="MINIMAL"
									directoryPath={directory}
									onDirectoryPathChanged={setDirectoryPath}
									directoryBarHoverPath={directoryBarHoverPath}
									onNavigate={setNavigationStack}/>
							</VideoDirectoryBrowserContext.Provider>
							{/* Modification buttons */ }
							<ButtonPanel className="modification-button-panel">
								<LabelGroup className="modification-label-group" label="Add">
									<FormDialog
										name="add-video-form"
										title="Add video"
										labelSize="medium"
										submitText="Add"
										onSuccess={addVideoFormHandler}
										trigger={<SmallButton>Video</SmallButton>}
										fieldData={[
											{
												name: "link",
												validator: (data: string) => {
													if (data.trim() == "") {
														return {
															success: false,
															reason: {
																name: "link",
																message: "This field is required."
															}
														}
													}

													let alreadyExistsResult: ValidatorResult<"link"> = {
														success: false,
														reason: {
															name: "link",
															message: "That video already exists."
														}
													}

													let videoID = getVideoIdFromYouTubeLink(data);

													if (videoID.success) {
														if (getNodeFromVideoID(tree, videoID.result) != null) {
															return alreadyExistsResult;
														}

														return { success: true };
													}
													
													if (data.length == 11 && getNodeFromVideoID(tree, data) != null) {
														return alreadyExistsResult;
													}

													return {
														success: false,
														reason: {
															name: "link",
															message: "The link provided was not a video."
														}
													}
												}
											}
										]}>
											<TextInput<AddVideoFormFields>
												label="Link or video:"
												name="link"
												title="The YouTube URL of the video to add. This will be added to the current directory."
												fieldSize="max"
												startValue=""/>
									</FormDialog>
									<FormDialog<AddDirectoryForm, AddDirectoryFormFields>
										name="add-directory-form"
										title="Add directory"
										labelSize="medium"
										submitText="Add"
										onSuccess={addDirectoryFormHandler}
										trigger={<SmallButton>Directory</SmallButton>}
										fieldData={[
											{
												name: "directoryName",
												validator: (data) => {
													let result = validateDirectoryName(data);
													let message: string | undefined;

													switch (result) {
														case "EMPTY":
															message = "Please enter a name.";
															break;
														case "TOO_LONG":
															message = `That name is too long, please enter something less than ${DIRECTORY_NAME_MAX_LENGTH} characters.`;
															break;
														case "INVALID_CHARACTERS":
															message = "That name contains an invalid character.";
															break;
														case "WHITESPACE_ONLY":
															message = "Name must contain at least one valid character.";
															break;
													}

													if (message != undefined) {
														return {
															success: false,
															reason: { name: "directoryName", message }
														}
													}

													let parent = tree.directoryNodes[getNodeFromPath(tree, parsePath(directoryPath))!];
													let existingIndex = parent.subNodes.findIndex(x => {
														let directoryNode = tree.directoryNodes[x];

														return directoryNode != undefined && directoryNode.slice == data;
													})

													if (existingIndex != -1) {
														return {
															success: false,
															reason: {
																name: "directoryName",
																message: "That directory already exists in this directory."	
															}
														}
													}

													return { success: true };
												}
											}
										]}>
											<TextInput<AddDirectoryFormFields>
												label="Directory Name:"
												title="Name of the new directory to be created in this directory."
												name="directoryName"
												fieldSize="max"
												startValue=""/>
									</FormDialog>
								</LabelGroup>
								<LabelGroup className="modification-label-group" label="Actions" placeLineAfter={false}>
									<SmallButton
										onClick={() => setDeleteConfirmationOpen(true)}
										disabled={selectedItems.length == 0}>
											Delete
									</SmallButton>
									<ActionMessageDialog
										title="Remove everything"
										body="Are you really sure you want to do this? This action will permanently delete all directories, saved videos and timestamps and is impossible to undo."
										buttons={[ "I understand, remove everything", "Cancel" ]}
										defaultFocusedButton="Cancel"
										defaultMessage="Cancel"
										onButtonPressed={clearEverything}>
											<SmallButton>Clear All</SmallButton>
									</ActionMessageDialog>
								</LabelGroup>
							</ButtonPanel>
						</>
					:
						<>
							<ul className="search-listbox separated-scrollbox">
								{
									Object
										.values(videos)
										.filter(v => searchFilter(v as IVideo))
										.map(x =>
											<VideoSearchItem
											videoID={x?.id ?? ""}
												onNavigate={(path) => {
													setSearchTerm(null);
													setDirectoryPath(path);
												}}
												key={x?.id}/>
											)
										}
							</ul>
							<div className="search-options">
								<SwitchInputPrimitive
									className="search-option-switch"
									label="Include titles"
									labelSize="auto"
									value={includeTitles}
									onChange={setIncludeTitles}/>
								<SwitchInputPrimitive
									className="search-option-switch"
									label="Include timestamps"
									labelSize="auto"
									value={includeTimestamps}
									onChange={setIncludeTimestamps}/>
							</div>
						</>
				}
			</div>
		</div>
	);
}
