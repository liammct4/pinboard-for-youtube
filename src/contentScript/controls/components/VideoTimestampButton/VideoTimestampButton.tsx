import { useDispatch, useSelector } from "react-redux";
import { useVideo } from "../../../../components/features/useVideo";
import { IVideo } from "../../../../lib/video/video";
import { CircularLargeButton } from "../CircularLargeButton/CircularLargeButton";
import { videoActions } from "../../../../features/video/videoSlice";
import { directoryActions } from "../../../../features/directory/directorySlice";
import { RootState } from "../../../../app/store";

export function VideoTimestampButton() {
	const { getVideo } = useVideo();
	const dispatch = useDispatch();
	const videoCache = useSelector((state: RootState) => state.cache.videoCache);

	let logoUrl = chrome.runtime.getURL("/assets/logo/logo.svg");

	const onSaveVideo = async () => {
		let videoID = document.querySelector(`meta[itemprop="identifier"]`)?.getAttribute("content") as string;
		let video = document.querySelector("video") as HTMLVideoElement;
	
		let existingVideo = getVideo(videoID) as IVideo;
	
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
	}

	return (
		<CircularLargeButton onClick={onSaveVideo}>
			<img src={logoUrl}/>
		</CircularLargeButton>
	);
}
