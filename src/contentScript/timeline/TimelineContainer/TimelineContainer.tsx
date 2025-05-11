import { useMemo, useRef, useState } from "react";
import { useLocalVideoData } from "../../features/useLocalVideoData";
import { TimelineButton } from "../components/TimelineButton/TimelineButton";
import { useBoundsChangeEvent } from "../../features/useBoundsChangeEvent";
import { IVideo, Timestamp } from "../../../lib/video/video";
import { useDispatch, useSelector } from "react-redux";
import { videoActions } from "../../../features/video/videoSlice";
import "./TimelineContainer.css"
import { RootState } from "../../../app/store";

export function TimelineContainer() {
	const timelineContainerRef = useRef<HTMLDivElement>(null!);
	const [ hover, setHover ] = useState<string | null>(null);
	const videoData = useLocalVideoData();
	const timelineBounds = useBoundsChangeEvent(timelineContainerRef);
	const videos = useSelector((state: RootState) => state.video.videos);
	const dispatch = useDispatch();
		
	if (!videoData.isVideoPage || videoData.isAdvertisement) {
		return <></>
	}
	
	let video = videos[videoData.data.videoID];

	if (video == undefined) {
		return <></>;
	}
	
	const onTimestampChange = (timestamp: Timestamp) => {
		if (video == undefined) {
			return;
		}

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