import { useVideo } from "../../../../components/features/useVideo";
import { useVideoStateAccess } from "../../../../components/features/useVideoStateAccess";
import { IVideo } from "../../../../lib/video/video";
import { CircularLargeButton } from "../CircularLargeButton/CircularLargeButton";

export function VideoTimestampButton() {
	let logoUrl = chrome.runtime.getURL("/assets/logo/logo.svg");
	const { directoryUpdateVideo, directoryAddVideo } = useVideoStateAccess();
	const { getVideo } = useVideo();

	const onSaveVideo = async () => {
		let videoID = document.querySelector(`meta[itemprop="identifier"]`)?.getAttribute("content") as string;
		let video = document.querySelector("video") as HTMLVideoElement;
	
		let existingVideo = getVideo(videoID) as IVideo;
	
		let newTimestamp = {
			id: crypto.randomUUID(), 
			time: Math.round(video.currentTime),
			message: "Saved timestamp.",
		}
	
		if (existingVideo == null) {
			// TODO: Selection menu.
			existingVideo = await directoryAddVideo(videoID, "$");
		}

		existingVideo.timestamps.push(newTimestamp);
		directoryUpdateVideo(existingVideo);
	}

	return (
		<CircularLargeButton onClick={onSaveVideo}>
			<img src={logoUrl}/>
		</CircularLargeButton>
	);
}
