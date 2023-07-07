import { useState, useRef, useEffect, useCallback, MutableRefObject } from "react"
import logo from "./../assets/logo/logo.png"
import SplitHeading from "./components/SplitHeading/SplitHeading.tsx"
import VideoCard from "./components/video/VideoCard/VideoCard.tsx"
import VideoTimestamp from "./components/video/VideoTimestamp/VideoTimestamp.tsx"
import VideoTimestampList from "./components/video/VideoTimestampList/VideoTimestampList.tsx"
import VideoCollection from "./components/video/VideoCollection/VideoCollection.tsx"
import * as TestData from "./data/testDataSet.ts"
import * as userData from "./lib/user/user-data.ts"
import { store, RootState } from "./app/store.ts"
import { Video } from "./lib/user/user-data.ts"
import { useSelector, useDispatch } from "react-redux"
import { addVideo, updateVideo, clearVideos } from "./features/videos/videoSlice.ts"
import * as YTUtil from "./lib/youtube-util.ts"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm, SubmitHandler, Validate, InternalFieldErrors } from "react-hook-form"
import "./styles/dialog.css"
import "./App.css"
import { FormField } from "./components/forms/FormField/FormField.tsx"
import { MultiEvent } from "./lib/events/Event.ts"
import { FormValidator, IErrorFieldValues, useValidatedForm } from "./components/forms/validated-form.ts"

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

function App(): JSX.Element {
	const videos: Array<Video> = useSelector((state: RootState) => state.video.currentVideos);
	const dispatch = useDispatch();
	const onAddVideo: SubmitHandler<IAddVideoForm> = useCallback((data) => {
		let newVideo: Video = {
			videoID: YTUtil.getVideoIdFromYouTubeLink(data.link),
			timestamps: []
		};

		dispatch(addVideo(newVideo));
	}, [videos]);
	let { register, handleSubmit, handler, submit, reset } = useValidatedForm<IAddVideoForm>(onAddVideo);

	useEffect(() => {
		reset();
	}, [reset, videos]);

	return (
		<div className="outer-body">
			<div className="outer-section-area top-area">
				<div id="top-section-inner-wrap">
					<img className="logo-standard" src="../assets/logo/logo.png"/>
					<h1 className="title-heading">Pinboard for YouTube</h1>
				</div>
				<hr></hr>
			</div>
			<div className="inner-body">
				{/* Current video */}
				<SplitHeading text="Current video"></SplitHeading>
				<div id="current-video-card">
					<VideoCard videoID="xcJtL7QggTI"></VideoCard>
				</div>
				<div className="button-bar">
					<button className="button-small">Save video</button>
					<button className="button-small">Pin timestamp</button>
				</div>
				{/* My timestamps */}
				<SplitHeading text="My video timestamps"></SplitHeading>
				<div className="button-bar regular-vmargin">
					{/* Add video dialog. */}
					<Dialog.Root>
						<Dialog.Trigger asChild>
							<button className="button-small">Add video</button>
						</Dialog.Trigger>
						<Dialog.Portal>
							<Dialog.Overlay className="dialog-overlay" />
							<Dialog.Content className="dialog-body">
								<Dialog.Title className="dialog-header">Add video</Dialog.Title>
								<div className="dialog-content">
									<form className="dialog-form add-video-form" id="edit-form" onSubmit={handleSubmit(handler)}>
										{/* Link */}
										<FormField<IAddVideoForm> register={register}
											label="Link:"
											name="link"
											size="max"
											submitEvent={submit.current}
											validationMethod={validateVideo}
											selector={(data: IAddVideoForm) => data.link}/>
										<Dialog.Close asChild>
											<button type="button" className="circle-button close-button" aria-label="Close">&times;</button>
										</Dialog.Close>
									</form>
								</div>
								<div className="dialog-footer">
									<input type="submit" value="Add" form="edit-form" className="button-small"></input>
									<Dialog.Close asChild>
										<button type="button" className="button-small">Close</button>
									</Dialog.Close>
								</div>
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
					<button className="button-small" onClick={() => dispatch(clearVideos())}>Clear videos</button>
				</div>
				<div id="timestamp-scrollbox">
					<VideoCollection videos={videos}></VideoCollection>
				</div>
			</div>
			<div className="outer-section-area bottom-area">
				<hr></hr>
				<div id="bottom-section-inner-wrap">
					<button style={{gridColumn: 1, gridRow: 1}} className="button-small">Options</button>
					<button style={{gridColumn: 1, gridRow: 2}} className="button-small">Help</button>
					<h2 className="outer-area-subtle-text">Version 1.0.0</h2>
				</div>
			</div>
		</div>
	);
}

export default App;
