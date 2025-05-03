/// <reference types="vite-plugin-svgr/client" />

import { useState } from "react";
import { ActionMessageDialog } from "../../components/dialogs/ActionDialogMessage.tsx";
import { FormDialog } from "../../components/dialogs/FormDialog.tsx";
import { SplitHeading } from "../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading.tsx";
import { VideoCard } from "../../components/video/VideoCard/VideoCard.tsx";
import { setDirectoryPath, setLayoutState } from "../../features/state/tempStateSlice.ts";
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
import { useVideoStateAccess } from "../../components/features/useVideoStateAccess.ts";
import { getVideoIdFromYouTubeLink, getYouTubeLinkFromVideoID } from "../../lib/util/youtube/youtubeUtil.ts";
import { VideoDirectoryBrowser } from "../../components/video/navigation/VideoDirectoryBrowser/VideoDirectoryBrowser.tsx";
import { VideoDirectoryBrowserContext } from "../../components/video/navigation/VideoDirectoryBrowser/VideoDirectoryBrowserContext.ts";
import { LabelGroup } from "../../components/presentation/Decorative/LabelGroup/LabelGroup.tsx";
import { DIRECTORY_NAME_MAX_LENGTH, findItemPathFromName, getItemFromPath, getRawSectionFromPrefix, getSectionPrefix, getSectionPrefixManual, getSectionType, IDirectoryNode, validateDirectoryName } from "../../lib/directory/directory.ts";
import { useNotificationMessage } from "../../components/features/notifications/useNotificationMessage.tsx";
import { getActiveVideoInfo } from "../../lib/browser/youtube.ts";
import { generateTimestamp, IVideo } from "../../lib/video/video.ts";
import { useActiveVideoID } from "../../components/features/activeVideo/useActiveVideo.tsx";
import "./../../styling/dialog.css"
import "./VideosPage.css"
import { useVideo } from "../../components/features/useVideo.ts";
import { removeVideo } from "../../features/video/videoSlice.ts";

interface IAddVideoForm extends IErrorFieldValues {
	link: string;
}

interface IAddDirectoryForm extends IErrorFieldValues {
	directoryName: string;
}

export function VideosPage(): React.ReactNode {
	const dispatch = useDispatch();
	const directoryPath = useSelector((state: RootState) => state.tempState.currentDirectory);
	const [ selectedItems, setSelectedItems ] = useState<string[]>([]);
	const [ currentlyEditing, setCurrentlyEditing ] = useState<string | null>(null);
	const [ deleteConfirmationOpen, setDeleteConfirmationOpen ] = useState<boolean>(false);
	const temporarySingleState = useSelector((state: RootState) => state.tempState.temporarySingleState);
	const layoutState = useSelector((state: RootState) => state.tempState.layout);
	const { activateMessage } = useNotificationMessage();
	const { root, directoryAddVideo, directoryUpdateVideo, directoryRemove, directoryRemoveVideo, directoryAdd, directoryClearAll } = useVideoStateAccess();
	const activeVideoID = useActiveVideoID();
	const { getVideo, videoExists } = useVideo();
	let addVideoForm = useValidatedForm<IAddVideoForm>((data) => {
		let id = getVideoIdFromYouTubeLink(data.link);
		
		directoryAddVideo(id, directoryPath);
	});
	let addDirectoryForm = useValidatedForm<IAddDirectoryForm>((data) => directoryAdd(directoryPath, data.directoryName));
	
	// Hotkeys for directory browser.
	useHotkeys("delete", () => setDeleteConfirmationOpen(selectedItems.length > 0));
	useHotkeys("F2", () => {
		if (selectedItems.length == 1) {
			setCurrentlyEditing(selectedItems[0]);
		}
	});
	
	const onSaveActiveVideo = async () => {
		const activeVideo = await getActiveVideoInfo();

		if (activeVideo == null) {
			return;
		}

		if (videoExists(activeVideo.id)) {
			let location = findItemPathFromName(root, activeVideo.id, false, true, true);
			let video = getVideo(activeVideo.id);

			// Should never happen since there should always be a location for a video.
			if (location.length == 0) {
				activateMessage(
					"An error has occured",
					"This video has already been added, however, while attempting to locate the videos directory, it could not be found, so to avoid issues, it has been placed within the root directory.",
					"Warning",
					"Warning",
					10000,
					"Shake"
				);

				dispatch(removeVideo(video!.id));
				directoryAddVideo(activeVideo.id, "$");

				// Override the newly "added" video.
				directoryUpdateVideo(video!);
			}
			else {	
				activateMessage(
					undefined,
					`That video already exists. It can be found in the directory "${location[0]}".`,
					"Info",
					"Info",
					undefined,
					"Slide"
				);
			}
			
			return;
		}

		directoryAddVideo(activeVideo.id, directoryPath);
	};
	const onPinCurrentTimestamp = async () => {
		const activeVideo = await getActiveVideoInfo();

		if (activeVideo == null || !videoExists(activeVideo.id)) {
			return;
		}

		let video = getVideo(activeVideo.id) as IVideo;
		
		let newActiveVideo: IVideo = {
			id: activeVideo.id,
			timestamps: [
				...video.timestamps,
				generateTimestamp(Math.floor(activeVideo!.currentTime), "Current time")
			]
		}
		
		directoryUpdateVideo(newActiveVideo);
	};
	const clearEverything = (action: string) => {
		if (action == "I understand, remove everything") {
			directoryClearAll();
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
						directoryRemove(directoryPath, selectedItems);
						directoryRemoveVideo(selectedItems
							.filter(x => getSectionType(x) == "VIDEO")
							.map(x => getRawSectionFromPrefix(x))
						);
					}

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
					onExpandedEvent={(value: boolean) => {
						dispatch(setLayoutState({ ...layoutState, isCurrentVideosSectionExpanded: value }));
					}}
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
						directoryPath={directoryPath}
						onDirectoryPathChanged={(newPath) => dispatch(setDirectoryPath(newPath))}/>
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

										let currentDirectory = getItemFromPath(directoryPath, root) as IDirectoryNode;
										let existingIndex = currentDirectory
											.subNodes
											.findIndex(x => getSectionPrefix(x) == getSectionPrefixManual(data, "DIRECTORY"));

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
