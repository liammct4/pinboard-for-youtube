import { useMemo, useRef, useState } from "react";
import { useLocalVideoData } from "../../features/useLocalVideoData";
import { TimelineButton } from "../components/TimelineButton/TimelineButton";
import { useBoundsChangeEvent } from "../../features/useBoundsChangeEvent";
import { IVideo, Timestamp } from "../../../lib/video/video";
import { useDispatch } from "react-redux";
import { useVideo } from "../../../components/features/useVideo";
import { videoActions } from "../../../features/video/videoSlice";
import "./TimelineContainer.css"

export function TimelineContainer() {
	const timelineContainerRef = useRef<HTMLDivElement>(null!);
	const [ hover, setHover ] = useState<string | null>(null);
	const videoData = useLocalVideoData();
	const timelineBounds = useBoundsChangeEvent(timelineContainerRef);
	const { getVideo, videoExists } = useVideo();
	const dispatch = useDispatch();

	// TODO: Replace.

	if (!videoData.isVideoPage || videoData.isAdvertisement) {
		return <></>
	}

	
	if (!videoExists(videoData.data.videoID)) {
		return <></>;
	}
	
	const video = getVideo(videoData.data.videoID) as IVideo;

	const onTimestampChange = (timestamp: Timestamp) => {
		let timestamps = [ ...video.timestamps ];
		let index = timestamps.findIndex(x => x.id == timestamp.id);
		
		timestamps[index] = timestamp;

		let newVideo: IVideo = {
			...video,
			timestamps
		};

		dispatch(videoActions.addOrReplaceVideo(newVideo));
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