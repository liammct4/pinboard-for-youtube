/// <reference types="vite-plugin-svgr/client" />

import { useState } from "react";
import { ActionMessageDialog } from "../../components/dialogs/ActionDialogMessage.tsx";
import { FormDialog } from "../../components/dialogs/FormDialog.tsx";
import { SplitHeading } from "../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading.tsx";
import { VideoCard } from "../../components/video/VideoCard/VideoCard.tsx";
import { IErrorFieldValues, useValidatedForm } from "../../components/forms/validated-form.ts";
import { FormField } from "../../components/forms/FormField/FormField.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store.ts";
import { IconContainer } from "../../components/images/svgAsset.tsx";
import { TwoToggleLayoutExpander } from "../../components/presentation/TwoToggleLayoutExpander/TwoToggleLayoutExpander.tsx";
import OpenLayoutIcon from "./../../../assets/icons/layout_expander_open.svg?react"
import CloseLayoutIcon from "./../../../assets/icons/layout_expander_close.svg?react"
import SearchIcon from "./../../../assets/symbols/search.svg?react"
import { useHotkeys } from "react-hotkeys-hook";
import { Spinner } from "../../components/presentation/Decorative/Spinner/Spinner.tsx";
import { getVideoIdFromYouTubeLink, getYouTubeLinkFromVideoID, IYoutubeVideoInfo } from "../../lib/util/youtube/youtubeUtil.ts";
import { VideoDirectoryBrowser } from "../../components/video/navigation/VideoDirectoryBrowser/VideoDirectoryBrowser.tsx";
import { VideoDirectoryBrowserContext } from "../../components/video/navigation/VideoDirectoryBrowser/VideoDirectoryBrowserContext.ts";
import { LabelGroup } from "../../components/presentation/Decorative/LabelGroup/LabelGroup.tsx";
import { useNotificationMessage } from "../../components/features/notifications/useNotificationMessage.tsx";
import { getActiveVideoInfo } from "../../lib/browser/youtube.ts";
import { generateTimestamp, IVideo } from "../../lib/video/video.ts";
import "./../../styling/dialog.css"
import "./VideosPage.css"
import { videoActions } from "../../features/video/videoSlice.ts";
import { directoryActions } from "../../features/directory/directorySlice.ts";
import { useVideoCache } from "../../components/features/useVideoInfo.ts";
import { DIRECTORY_NAME_MAX_LENGTH, getNodeFromPath, getNodeType, getPathOfNode, NodeRef } from "../../lib/directory/directory.ts";
import { NodePath, parsePath, pathToString, validateDirectoryName } from "../../lib/directory/path.ts";
import { tempStateActions, tempStateSlice } from "../../features/state/tempStateSlice.ts";

interface IAddVideoForm extends IErrorFieldValues {
	link: string;
}

interface IAddDirectoryForm extends IErrorFieldValues {
	directoryName: string;
}

export function VideosPage(): React.ReactNode {
	const dispatch = useDispatch();
	const directoryPath = useSelector((state: RootState) => state.tempState.currentDirectory);
	const [ selectedItems, setSelectedItems ] = useState<NodeRef[]>([]);
	const [ currentlyEditing, setCurrentlyEditing ] = useState<NodeRef | null>(null);
	const [ deleteConfirmationOpen, setDeleteConfirmationOpen ] = useState<boolean>(false);
	const temporarySingleState = useSelector((state: RootState) => state.tempState.temporarySingleState);
	const layoutState = useSelector((state: RootState) => state.tempState.layout);
	const activeVideoID = useSelector((state: RootState) => state.video.activeVideoID);
	const videos = useSelector((state: RootState) => state.video.videos);
	const { retrieveInfo } = useVideoCache();
	const videoCache = useSelector((state: RootState) => state.cache.videoCache);
	const tree = useSelector((state: RootState) => state.directory.videoBrowser);
	let addVideoForm = useValidatedForm<IAddVideoForm>(async (data) => {
		let id = getVideoIdFromYouTubeLink(data.link);
		
		let info = await retrieveInfo(id);

		dispatch(videoActions.addVideo({
			id,
			timestamps: []
		}));

		dispatch(directoryActions.createVideoNode({
			parentPath: directoryPath,
			videoID: id,
			videoData: [ ...videoCache, info as IYoutubeVideoInfo ]
		}));
	});
	let addDirectoryForm = useValidatedForm<IAddDirectoryForm>((data) => dispatch(
		directoryActions.createDirectoryNode({
			parentPath: directoryPath,
			slice: data.directoryName
		})
	));

	// Hotkeys for directory browser.
	useHotkeys("delete", () => setDeleteConfirmationOpen(selectedItems.length > 0));
	useHotkeys("F2", () => {
		if (selectedItems.length == 1) {
			setCurrentlyEditing(selectedItems[0]);
		}
	});
	
	const onSaveActiveVideo = async () => {
		if (activeVideoID == undefined) {
			return;
		}

		let info = await retrieveInfo(activeVideoID) as IYoutubeVideoInfo;

		dispatch(videoActions.addVideo({ id: activeVideoID, timestamps: [] }));
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
		}
	};

	return (
		<div className="video-page-outer">
			{/* Delete selected sections confirmation dialog */}
			<ActionMessageDialog
				buttons={["Yes", "Cancel"]}
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
					expanded={layoutState.isCurrentVideosSectionExpanded}
					onExpandedEvent={(value: boolean) =>
						dispatch(tempStateActions.setLayoutState({ ...layoutState, isCurrentVideosSectionExpanded: value }))
					}
					openButtonContent={<IconContainer asset={OpenLayoutIcon} className="icon-colour-standard" use-stroke use-fill/>}
					closeButtonContent={<IconContainer asset={CloseLayoutIcon} className="icon-colour-standard" use-stroke use-fill/>}
					openTooltip="Show current video controls and saved timestamps."
					closeTooltip="Only show saved timestamps."
					align="right">
						{/* Current video */}
						<SplitHeading className="current-video-heading" text="Current video"/>
						<VideoCard className="current-video-card" videoID={activeVideoID ?? undefined} placeholderTitle="No video found!"/>
						{/* Current video controls */}
						<div className="current-video-buttons">
							<button className="button-base button-small" onClick={onSaveActiveVideo} disabled={activeVideoID == null}>Save video</button>
							<button className="button-base button-small" onClick={onPinCurrentTimestamp} disabled={activeVideoID == null}>Pin timestamp</button>
						</div>
				</TwoToggleLayoutExpander>
				{/* My timestamps */}
				<SplitHeading className="video-collection-section-heading" text="My video timestamps"></SplitHeading>
				<div className="video-navigation-panel">
					{/* Search bar. */}
					<form className="search-bar-form">
						<input className="small-text-input" type="text"/>
						<button className="button-base button-small circle-button" type="submit">
							<IconContainer
								asset={SearchIcon}
								className="icon-colour-standard"
								use-stroke/>
						</button>
					</form>
				</div>
				<VideoDirectoryBrowserContext.Provider
					value={{
						selectedItems,
						setSelectedItems,
						currentlyEditing,
						setCurrentlyEditing
					}}>
					<VideoDirectoryBrowser
						defaultVideoStyle="MINIMAL"
						directoryPath={parsePath(directoryPath)}
						onDirectoryPathChanged={(newPath) => dispatch(tempStateActions.setDirectoryPath(pathToString(newPath)))}/>
				</VideoDirectoryBrowserContext.Provider>
				{/* Modification buttons */ }
				<div className="modification-button-panel">
					<LabelGroup className="modification-label-group" label="Add">
						<FormDialog
							formID="add-video-form"
							formTitle="Add video"
							labelSize="small"
							submitText="Add"
							trigger={<button className="button-base button-small">Video</button>}
							handleSubmit={addVideoForm.handleSubmit(addVideoForm.handler)}>
								<FormField<IAddVideoForm>
									register={addVideoForm.register}
									label="Link:"
									name="link"
									fieldSize="max"
									submitEvent={addVideoForm.submit.current}
									selector={(data: IAddVideoForm) => data.link}/>
						</FormDialog>
						<FormDialog
							formID="add-directory-form"
							formTitle="Add directory"
							labelSize="medium"
							submitText="Add"
							trigger={<button className="button-base button-small">Directory</button>}
							handleSubmit={addDirectoryForm.handleSubmit(addDirectoryForm.handler)}>
								<FormField<IAddDirectoryForm> register={addDirectoryForm.register}
									label="Section Name:"
									name="directoryName"
									fieldSize="max"
									validationMethod={(data) => {
										let result = validateDirectoryName(data);

										switch (result) {
											case "EMPTY":
												return "Please enter a name.";
											case "TOO_LONG":
												return `That name is too long, please enter something less than ${DIRECTORY_NAME_MAX_LENGTH} characters.`;
											case "INVALID_CHARACTERS":
												return "That name contains an invalid character.";
											case "WHITESPACE_ONLY":
												return "Name must contain at least one valid character.";
										}

										let parent = tree.directoryNodes[getNodeFromPath(tree, parsePath(directoryPath))!];
										let existingIndex = parent.subNodes.findIndex(x => {
											let directoryNode = tree.directoryNodes[x];

											return directoryNode != undefined && directoryNode.slice == result;
										})

										if (existingIndex != -1) {
											return "That directory already exists in this directory.";
										}

										return null;
									}}
									submitEvent={addDirectoryForm.submit.current}
									selector={(data: IAddDirectoryForm) => data.directoryName}/>
						</FormDialog>
					</LabelGroup>
					<LabelGroup className="modification-label-group" label="Actions" placeLineAfter={false}>
						<ActionMessageDialog
							title="Remove everything"
							body="Are you really sure you want to do this? This action will permanently delete all directories, saved videos and timestamps and is impossible to undo."
							buttons={[ "I understand, remove everything", "Cancel" ]}
							onButtonPressed={clearEverything}>
							<button className="button-base button-small">Clear All</button>
						</ActionMessageDialog>
					</LabelGroup>
				</div>
			</div>
		</div>
	);
}
