import { useCallback, useEffect, useMemo, useState } from "react";
import ActionMessageDialog from "../../components/dialogs/ActionDialogMessage.tsx";
import FormDialog from "../../components/dialogs/FormDialog.tsx";
import SplitHeading from "../../components/presentation/SplitHeading/SplitHeading.tsx";
import VideoCard from "../../components/video/VideoCard/VideoCard.tsx";
import VideoCollection from "../../components/video/VideoCollection/VideoCollection.tsx";
import { VideoListContext } from "../../context/video.ts";
import * as YTUtil from "../../lib/util/youtube/youtubeUtil.ts"
import { addVideo, clearVideos, setTagFilter, setVideos, updateVideo } from "../../features/videos/videoSlice.ts";
import { addExpandedID, removeExpandedID, setLayoutState } from "../../features/state/tempStateSlice.ts";
import { Video, generateTimestamp } from "../../lib/video/video.ts";
import { getActiveVideoInfo } from "../../lib/browser/youtube.ts";
import { IErrorFieldValues, useValidatedForm } from "../../components/forms/validated-form.ts";
import { FormField } from "../../components/forms/FormField/FormField.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../app/store.ts";
import { SubmitHandler } from "react-hook-form";
import { ReactComponent as TagIcon} from "./../../../assets/icons/tag.svg"
import { IconContainer } from "../../components/images/svgAsset.tsx";
import { useNavigate } from "react-router-dom";
import * as Select from "@radix-ui/react-select";
import { SelectItem } from "../../components/input/DropdownInput/dropdown.tsx";
import { TwoToggleLayoutExpander } from "../../components/presentation/TwoToggleLayoutExpander/TwoToggleLayoutExpander.tsx";
import { ReactComponent as ArrowIcon } from "./../../../assets/symbols/arrow.svg"
import { ReactComponent as OpenLayoutIcon } from "./../../../assets/icons/layout_expander_open.svg"
import { ReactComponent as CloseLayoutIcon } from "./../../../assets/icons/layout_expander_close.svg"
import { ReactComponent as SearchIcon } from "./../../../assets/symbols/search.svg"
import "./../../styling/dialog.css"
import "./VideosPage.css"

interface IAddVideoForm extends IErrorFieldValues {
	link: string;
	error: boolean
}

function validateVideo(value: string): string | null {
	// Don't use 'videos' with useSelector at the top as it will not be updated
	// if the videos in the store changes.
	let currentVideos = store.getState().video.currentVideos;
	
	if (value.length == 0) {
		return "This field is required."
	}
	else if (!YTUtil.YOUTUBE_EXTRACT_VIDEO_ID_REGEX.test(value)) {
		return "The link entered was invalid."
	}
	else if (!YTUtil.videoExists(value)) {
		return "Video does not exist.";
	}
	else if (currentVideos.findIndex(x => x.videoID == YTUtil.getVideoIdFromYouTubeLink(value)) != -1) {
		return "Video has already been added.";
	}
	
	return null;
}

export function VideosPage(): React.ReactNode {
	const videos: Array<Video> = useSelector((state: RootState) => state.video.currentVideos);
	const activeVideoID: string | undefined = useSelector((state: RootState) => state.video.activeVideoID);
	const openVideos = useSelector((state: RootState) => state.tempState.expandedVideoIDs);
	const tagDefinitions = useSelector((state: RootState) => state.video.tagDefinitions);
	const layoutState = useSelector((state: RootState) => state.tempState.layout);
	const tagFilter = useSelector((state: RootState) => state.video.currentSelectedTagFilter);
	const tagFilterDefinition = useMemo(() => tagDefinitions.find(x => x.id == tagFilter), [tagFilter]);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [ filterTitleText, setFilterTitleText ] = useState("");
	const filteredVideos = useMemo(() => videos.filter(x => {
		let tagFiltered = tagFilter == "" || x.appliedTags.includes(tagFilter);

		// TODO: Cache retrieved information.
		let title = (YTUtil.getYoutubeVideoInfoFromVideoID(x.videoID)).title.toLowerCase();

		let filterWords = filterTitleText.split(' ');
		let titleWords = title.split(' ');
		let searchFiltered = filterTitleText == "" || title.includes(filterTitleText) || filterWords.every(val => titleWords.includes(val));

		return tagFiltered && searchFiltered;
	}), [tagDefinitions, tagFilter, videos, filterTitleText]);
	const onAddVideo: SubmitHandler<IAddVideoForm> = useCallback((data) => {
		let newVideo: Video = {
			videoID: YTUtil.getVideoIdFromYouTubeLink(data.link),
			timestamps: [],
			appliedTags: []
		};

		dispatch(addVideo(newVideo));
	}, [videos]);
	const onSaveActiveVideo: () => void = () => {
		if (videos.find(x => x.videoID == activeVideoID) != undefined) {
			return;
		}

		let video: Video = {
			videoID: activeVideoID!,
			timestamps: [],
			appliedTags: []
		};
		dispatch(addVideo(video));
	};
	const onPinCurrentTimestamp = async () => {
		let result = await getActiveVideoInfo();
		let video = videos.find(x => x.videoID == activeVideoID)!;
		
		let activeVideo: Video = {
			videoID: activeVideoID!,
			timestamps: [
				...video.timestamps,
				generateTimestamp(Math.floor(result!.currentTime), "Current time")
			],
			appliedTags: video.appliedTags
		}
		
		dispatch(updateVideo(activeVideo));
	};
	const handleReorderedItems = (reordered: Array<Video>) => {
		// To mitigate lag from store dispatching.
		let listener = (_event: any) => {
			document.removeEventListener("mouseup", listener);
			setTimeout(() => {
				dispatch(setVideos(reordered));
			}, 100);
		}

		document.addEventListener("mouseup", listener);
	}
	let { register, handleSubmit, handler, submit, reset } = useValidatedForm<IAddVideoForm>(onAddVideo);
	useEffect(() => {
		reset();
	}, [reset, videos]);

	return (
		<div className="video-page-inner">
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
					<VideoCard className="current-video-card" videoID={activeVideoID} placeholderTitle="No video found!"/>
					{/* Current video controls */}
					<div className="current-video-buttons">
						<button className="button-base button-small" onClick={onSaveActiveVideo} disabled={activeVideoID == null}>Save video</button>
						<button className="button-base button-small" onClick={onPinCurrentTimestamp} disabled={videos.find(x => x.videoID == activeVideoID) == undefined}>Pin timestamp</button>
					</div>
			</TwoToggleLayoutExpander>
			{/* My timestamps */}
			<SplitHeading className="video-collection-section-heading" text="My video timestamps"></SplitHeading>
			<div className="video-collection-buttons">
				{/* Add video dialog. */}
				<FormDialog
					formID="add-video-form"
					formTitle="Add video"
					labelSize="small"
					submitText="Add"
					trigger={<button className="button-base button-small">Add video</button>}
					handleSubmit={handleSubmit(handler)}>
						<FormField<IAddVideoForm> register={register}
							label="Link:"
							name="link"
							fieldSize="max"
							submitEvent={submit.current}
							validationMethod={validateVideo}
							selector={(data: IAddVideoForm) => data.link}/>
				</FormDialog>
				<ActionMessageDialog
					title="Clear all videos"
					body="Are you sure you want to continue? This will permanently delete all saved videos and timestamps and cannot be undone."
					buttons={[ "Continue", "Cancel" ]}
					onButtonPressed={(action: string) => {
						if (action == "Continue") {
							dispatch(clearVideos());
						}
					}}>
					<button className="button-base button-small">Clear videos</button>
				</ActionMessageDialog>
				{/* Empty div to fill the horizontal space in the grid. */}
				<div/>
				{/* Tag filter & tag edit page. */}
				<Select.Root defaultValue={tagFilter} onValueChange={(value) => dispatch(setTagFilter(value))}> 
					<Select.Trigger className="open-filter-dropdown select-button">
						<Select.Value defaultValue={tagFilter} placeholder={<span className="open-filter-placeholder">None</span>}>{tagFilterDefinition != null ? tagFilterDefinition?.name : <span className="open-filter-placeholder">Tag filter...</span>}</Select.Value>
						<IconContainer
							className="icon-colour-standard dropdown-arrow"
							asset={ArrowIcon}
							use-stroke/>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content className="select-dropdown-content">
							<Select.Viewport className="select-viewport">
								<Select.Group className="select-group">
									{[<SelectItem key="placeholder" value=""><span className="open-filter-placeholder">None</span></SelectItem>, ...tagDefinitions.map(x => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)]}
								</Select.Group>
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
				<button className="button-base button-small square-button" onClick={() => navigate("../tags")}>
					<IconContainer className="icon-colour-standard" asset={TagIcon} use-fill use-stroke manual-stroke="--pfy-primary-ultradark"/>
				</button>
				{/* Search bar. */}
				<form className="search-bar-form" onSubmit={(e) => {
						e.preventDefault();

						// @ts-ignore Retrieves the text box value. e.target is an array of input elements.
						let messageText = (e.target[0] as HTMLInputElement).value;

						setFilterTitleText(messageText.toLowerCase());
					}}>
					<input className="small-text-input" type="text"/>
					<button className="button-base button-small circle-button" type="submit">
						<IconContainer
							asset={SearchIcon}
							className="icon-colour-standard"
							use-stroke/>
					</button>
				</form>
			</div>
			<div className="video-collection-scrollbox">
				<VideoListContext.Provider value={{
					activeVideoID,
					videos: filteredVideos,
					openVideos,
					tagDefinitions,
					actions: {
						addVideo,
						updateVideo,
						clearVideos,
						setVideos,
						addExpandedID,
						removeExpandedID
					}
				}}>
					<VideoCollection onReorder={handleReorderedItems}></VideoCollection>
				</VideoListContext.Provider>
			</div>
		</div>
	);
}
