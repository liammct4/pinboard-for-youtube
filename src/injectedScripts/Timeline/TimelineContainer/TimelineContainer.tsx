import { useLocalStorage } from "../../../components/features/storage/useLocalStorage"
import { useLocalVideoData } from "../../features/useLocalVideoData";
import { TimelineButton } from "../components/TimelineButton/TimelineButton";
import "./TimelineContainer.css"

export function TimelineContainer() {
	const { storage } = useLocalStorage();
	const videoData = useLocalVideoData();

	if (!videoData.isVideoPage) {
		return <></>
	}

	const video = storage.user_data.videos.find(x => x.id == videoData.data.videoID);

	if (video == null) {
		return <></>;
	}

	return (
		<div className="pfy-timeline-container">
			{
				video.timestamps.map(x => <TimelineButton timestamp={x}/>)
			}
		</div>
	)
}