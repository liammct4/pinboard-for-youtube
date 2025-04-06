import { useRef } from "react";
import { useLocalStorage } from "../../../components/features/storage/useLocalStorage"
import { useLocalVideoData } from "../../features/useLocalVideoData";
import { TimelineButton } from "../components/TimelineButton/TimelineButton";
import { useBoundsChangeEvent } from "../../features/useBoundsChangeEvent";
import "./TimelineContainer.css"

export function TimelineContainer() {
	const timelineContainerRef = useRef<HTMLDivElement>(null!);
	const { storage } = useLocalStorage();
	const videoData = useLocalVideoData();
	const timelineBounds = useBoundsChangeEvent(timelineContainerRef);

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
				video.timestamps.map(x => <TimelineButton timestamp={x} timelineBounds={timelineBounds}/>)
			}
		</div>
	)
}