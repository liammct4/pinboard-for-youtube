import { useContext, useEffect, useRef, useState } from "react";
import { TimelineButton } from "../components/TimelineButton/TimelineButton";
import { useBoundsChangeEvent } from "../../features/useBoundsChangeEvent";
import { createTimestamp, IVideo, Timestamp } from "../../../lib/video/video";
import { useDispatch, useSelector } from "react-redux";
import { videoActions } from "../../../features/video/videoSlice";
import { RootState } from "../../../app/store";
import { Keys, useHotkeys } from "react-hotkeys-hook";
import "./TimelineContainer.css"
import { LocalVideoDataContext } from "../../features/LocalVideoDataWrapper";

export function TimelineContainer() {
	const timelineContainerRef = useRef<HTMLDivElement>(null!);
	const [ hover, setHover ] = useState<string | null>(null);
	const videoData = useContext(LocalVideoDataContext);
	const timelineBounds = useBoundsChangeEvent(timelineContainerRef);
	const videos = useSelector((state: RootState) => state.video.videos);
	const dispatch = useDispatch();
	const {
		timestampButtonsEnabled,
		useAutoSaveLatestTimestamp,
		autoSaveLatestTimestampMessage,
	} = useSelector((state: RootState) => state.settings.settings);

	useEffect(() => {
		if (!videoData.isVideoPage || videoData.isAdvertisement || !timestampButtonsEnabled || !useAutoSaveLatestTimestamp) {
			return;
		}
		
		let video = videos[videoData.data.videoID];
		
		if (video == undefined) {
			return;
		}

		let timestampIndex = video.timestamps.findIndex(t => t.id == video.autoplayTimestamp);
		let updatedVideo: IVideo = {
			...video
		} as IVideo;

		if (timestampIndex == -1) {
			timestampIndex = updatedVideo.timestamps.length;

			let newTimestamp = {
				id: createTimestamp(),
				message: autoSaveLatestTimestampMessage as string,
				time: Math.round(videoData.data.currentTime)
			};

			updatedVideo.autoplayTimestamp = newTimestamp.id;
			updatedVideo.timestamps = [ ...updatedVideo.timestamps, newTimestamp ];
		}
		else {
			// Don't bring backward.
			if (updatedVideo.timestamps[timestampIndex].time > videoData.data.currentTime) {
				return;
			}

			let updatedTimestamps = [ ...updatedVideo.timestamps ];

			updatedTimestamps[timestampIndex] = {
				...updatedTimestamps[timestampIndex],
				time: Math.round(videoData.data.currentTime)
			};

			updatedVideo.timestamps = updatedTimestamps;
		}

		dispatch(videoActions.addOrReplaceVideo(updatedVideo));
	}, [ Math.round(videoData?.isVideoPage ? videoData?.data?.currentTime : 0)]);
	
	if (!videoData.isVideoPage || videoData.isAdvertisement || !timestampButtonsEnabled) {
		return <div className="pfy-timeline-container" ref={timelineContainerRef}/>;
	}
	
	let video = videos[videoData.data.videoID];

	if (video == undefined) {
		return <div className="pfy-timeline-container" ref={timelineContainerRef}/>;
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
						isAutoplayButton={video.autoplayTimestamp == x.id}
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