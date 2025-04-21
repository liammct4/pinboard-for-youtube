import { useMemo, useRef, useState } from "react";
import { useLocalStorage } from "../../../components/features/storage/useLocalStorage"
import { useLocalVideoData } from "../../features/useLocalVideoData";
import { TimelineButton } from "../components/TimelineButton/TimelineButton";
import { useBoundsChangeEvent } from "../../features/useBoundsChangeEvent";
import { useVideoStateAccess } from "../../../components/features/useVideoStateAccess";
import { IVideo, Timestamp } from "../../../lib/video/video";
import "./TimelineContainer.css"

export function TimelineContainer() {
	const timelineContainerRef = useRef<HTMLDivElement>(null!);
	const [ hover, setHover ] = useState<string | null>(null);
	const { storage } = useLocalStorage();
	const videoData = useLocalVideoData();
	const { directoryUpdateVideo } = useVideoStateAccess(storage.auth.currentUser ?? null);
	const timelineBounds = useBoundsChangeEvent(timelineContainerRef);

	if (!videoData.isVideoPage || videoData.isAdvertisement) {
		return <></>
	}

	const video = storage.user_data.videos.find(x => x.id == videoData.data.videoID);

	if (video == null) {
		return <></>;
	}

	const onTimestampChange = (timestamp: Timestamp) => {
		let timestamps = [ ...video.timestamps ];
		let index = timestamps.findIndex(x => x.id == timestamp.id);
		
		timestamps[index] = timestamp;

		let newVideo: IVideo = {
			...video,
			timestamps
		};

		directoryUpdateVideo(newVideo);
	}

	return (
		<div className="pfy-timeline-container" ref={timelineContainerRef}>
			{
				video.timestamps.map(x => 
					<TimelineButton
						timestamp={x}
						timelineBounds={timelineBounds}
						data-hover-highlight={hover != null}
						data-active-hover-highlight={hover == x.id}
						onChange={onTimestampChange}
						activeHover={hover}
						onHoverChanged={setHover}/>
				)
			}
		</div>
	)
}