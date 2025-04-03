import { useRef } from "react";
import { useLocalStorage } from "../../../components/features/storage/useLocalStorage"
import { useLocalVideoData } from "../../features/useLocalVideoData";
import { useResizeEvent } from "../../features/useResizeEvent";
import { TimelineButton } from "../components/TimelineButton/TimelineButton";
import "./TimelineContainer.css"

export function TimelineContainer() {
	const timelineContainerRef = useRef<HTMLDivElement>(null!);
	const { storage } = useLocalStorage();
	const videoData = useLocalVideoData();
	const { size } = useResizeEvent(timelineContainerRef);

	if (!videoData.isVideoPage) {
		return <></>
	}

	const video = storage.user_data.videos.find(x => x.id == videoData.data.videoID);

	if (video == null) {
		return <></>;
	}

	return (
		<div className="pfy-timeline-container" ref={timelineContainerRef}>
			{
				video.timestamps.map(x => <TimelineButton timestamp={x} timelineWidth={size.width}/>)
			}
		</div>
	)
}