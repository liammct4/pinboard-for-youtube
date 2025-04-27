import { useLocalStorage } from "../../../../components/features/storage/useLocalStorage";
import { useVideoStateAccess } from "../../../../components/features/useVideoStateAccess";
import { IVideo } from "../../../../lib/video/video";
import { CircularLargeButton } from "../CircularLargeButton/CircularLargeButton";

export function VideoTimestampButton() {
	let logoUrl = chrome.runtime.getURL("/assets/logo/logo.svg");
	const { storage } = useLocalStorage();
	const { videoData, directoryUpdateVideo, directoryAddVideo } = useVideoStateAccess(storage.auth.currentUser ?? null);

	const onSaveVideo = async () => {
		let videoID = document.querySelector(`meta[itemprop="identifier"]`)?.getAttribute("content") as string;
		let video = document.querySelector("video") as HTMLVideoElement;
	
		let existingVideo = videoData.get(videoID);
	
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
