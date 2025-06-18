import { useDispatch, useSelector } from "react-redux";
import { IVideo } from "../../../../lib/video/video";
import { CircularLargeButton } from "../CircularLargeButton/CircularLargeButton";
import { videoActions } from "../../../../features/video/videoSlice";
import { directoryActions } from "../../../../features/directory/directorySlice";
import { RootState } from "../../../../app/store";
import { Keys, useHotkeys } from "react-hotkeys-hook";
import { extractIDRegex } from "../../../features/useLocalVideoData";

export function VideoTimestampButton() {
	const dispatch = useDispatch();
	const videoCache = useSelector((state: RootState) => state.cache.videoCache);
	const videos = useSelector((state: RootState) => state.video.videos);
	const { saveVideoTimestampButtonEnabled, pinCurrentTimestampShortcut } = useSelector((state: RootState) => state.settings.settings);

	const onSaveVideo = async () => {
		let result = extractIDRegex.exec(window.location.href);
		
		if (result == null || result.groups == undefined) {
			return;
		}

		let videoID = result.groups["videoID"] as string;
		let video = document.querySelector("video") as HTMLVideoElement;
	
		let existingVideo = videos[videoID] as IVideo;
	
		let newTimestamp = {
			id: crypto.randomUUID(), 
			time: Math.round(video.currentTime),
			message: "Saved timestamp.",
		}

		let updatedVideo: IVideo;
	
		if (existingVideo == null) {
			updatedVideo = {
				id: videoID,
				timestamps: [ newTimestamp ]
			}
			
			// TODO: Selection menu.
			dispatch(directoryActions.createVideoNode({
				parentPath: "$",
				videoID,
				videoData: videoCache
			}));
		}
		else {
			updatedVideo = {
				...existingVideo,
				timestamps: [
					...existingVideo.timestamps,
					newTimestamp
				]
			};
		}

		dispatch(videoActions.addOrReplaceVideo(updatedVideo));
	};

	useHotkeys(pinCurrentTimestampShortcut as Keys, onSaveVideo);

	if (!saveVideoTimestampButtonEnabled) {
		return <></>;
	}

	let logoUrl = chrome.runtime.getURL("/assets/logo/logo.svg");

	return (
		<CircularLargeButton onClick={onSaveVideo}>
			<img src={logoUrl}/>
		</CircularLargeButton>
	);
}
