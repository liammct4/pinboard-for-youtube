import { useState } from "react";
import { ActionMessageDialog } from "../../components/dialogs/ActionDialogMessage.tsx";
import { FormDialog } from "../../components/dialogs/FormDialog.tsx";
import { SplitHeading } from "../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading.tsx";
import { VideoCard } from "../../components/video/VideoCard/VideoCard.tsx";
import { setLayoutState } from "../../features/state/tempStateSlice.ts";
import { IErrorFieldValues, useValidatedForm } from "../../components/forms/validated-form.ts";
import { FormField } from "../../components/forms/FormField/FormField.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store.ts";
import { ReactComponent as TagIcon} from "./../../../assets/icons/tag.svg"
import { IconContainer } from "../../components/images/svgAsset.tsx";
import { useNavigate } from "react-router-dom";
import { TwoToggleLayoutExpander } from "../../components/presentation/TwoToggleLayoutExpander/TwoToggleLayoutExpander.tsx";
import { ReactComponent as OpenLayoutIcon } from "./../../../assets/icons/layout_expander_open.svg"
import { ReactComponent as CloseLayoutIcon } from "./../../../assets/icons/layout_expander_close.svg"
import { ReactComponent as SearchIcon } from "./../../../assets/symbols/search.svg"
import { ReactComponent as DeleteIcon } from "./../../../assets/icons/bin.svg"
import { useHotkeys } from "react-hotkeys-hook";
import { Spinner } from "../../components/presentation/Decorative/Spinner/Spinner.tsx";
import { useVideoAccess } from "../../components/features/useVideoAccess.ts";
import { getVideoIdFromYouTubeLink } from "../../lib/util/youtube/youtubeUtil.ts";
import "./../../styling/dialog.css"
import "./VideosPage.css"
import { VideoDirectoryBrowser } from "../../components/video/navigation/VideoDirectoryBrowser/VideoDirectoryBrowser.tsx";
import { VideoDirectoryInteractionContext } from "../../components/video/navigation/directory.ts";

interface IAddVideoForm extends IErrorFieldValues {
	link: string;
	error: boolean
}

export function VideosPage(): React.ReactNode {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [ inDeleteMode, setInDeleteMode ] = useState<boolean>(false);
	const temporarySingleState = useSelector((state: RootState) => state.tempState.temporarySingleState);
	const layoutState = useSelector((state: RootState) => state.tempState.layout);
	const { videoData, addVideo, removeVideo } = useVideoAccess();
	let { register, handleSubmit, handler, submit, reset } = useValidatedForm<IAddVideoForm>((data) => {
		let id = getVideoIdFromYouTubeLink(data.link);

		addVideo(id);
	});
	useHotkeys("delete", () => setInDeleteMode(!inDeleteMode));

	// TODO
	const activeVideoID = "";
	const onSaveActiveVideo = () => { };
	const onPinCurrentTimestamp = () => { };
	const clearVideos = () => { };

	return (
		<div className="video-page-outer">
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
						<VideoCard className="current-video-card" videoID={activeVideoID} placeholderTitle="No video found!"/>
						{/* Current video controls */}
						<div className="current-video-buttons">
							<button className="button-base button-small" onClick={onSaveActiveVideo} disabled={activeVideoID == null}>Save video</button>
							<button className="button-base button-small" onClick={onPinCurrentTimestamp}>Pin timestamp</button>
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
								selector={(data: IAddVideoForm) => data.link}/>
					</FormDialog>
					<ActionMessageDialog
						title="Clear all videos"
						body="Are you sure you want to continue? This will permanently delete all saved videos and timestamps and cannot be undone."
						buttons={[ "Continue", "Cancel" ]}
						onButtonPressed={() => {}}>
						<button className="button-base button-small">Clear videos</button>
					</ActionMessageDialog>
					{/* Delete mode button */}
					<button className="button-base button-small square-button" title="Delete mode" onClick={() => setInDeleteMode(!inDeleteMode)} data-active-toggle={inDeleteMode}>
						<IconContainer className="icon-colour-standard" asset={DeleteIcon} use-stroke attached-attributes={{ "data-active-toggle": inDeleteMode }}/>
					</button>
					{/* Empty div to fill the horizontal space in the grid. */}
					<div/>
					<button className="button-base button-small square-button" onClick={() => navigate("../tags")}>
						<IconContainer className="icon-colour-standard" asset={TagIcon} use-fill use-stroke manual-stroke="--pfy-primary-ultradark"/>
					</button>
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
				<div className="separated-scrollbox">
					<VideoDirectoryBrowser>

					</VideoDirectoryBrowser>
				</div>
			</div>
		</div>
	);
}
