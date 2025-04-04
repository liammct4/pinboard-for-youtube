import { useEffect, useMemo, useRef, useState } from "react";
import { Timestamp } from "../../../../lib/video/video"
import { getTimestampFromSeconds } from "../../../../lib/util/generic/timeUtil";
import { useLocalVideoData } from "../../../features/useLocalVideoData";
import { IconContainer } from "../../../../components/images/svgAsset";
import ArrowDown from "./../../../../../assets/misc/arrow_down_timeline.svg?react"
import { useLocalVideoControls } from "../../../features/useLocalVideoControls";
import "./TimelineButton.css"
import { useResizeEvent } from "../../../features/useResizeEvent";
import { Size } from "../../../../lib/util/objects/types";

export interface ITimelineButtonProperties {
	timestamp: Timestamp;
	timelineWidth: number;
}

export function TimelineButton({ timestamp, timelineWidth }: ITimelineButtonProperties) {
	const buttonRef = useRef<HTMLButtonElement>(null!);
	const arrowRef = useRef<HTMLDivElement>(null!);
	const videoData = useLocalVideoData();
	const { setCurrentTime } = useLocalVideoControls();
	const secondTime = useMemo(() => getTimestampFromSeconds(timestamp.time), [timestamp.time]);
	const [ hover, setHover ] = useState<boolean>(false);
	const { size: buttonSize } = useResizeEvent(buttonRef);
	const { size: arrowSize } = useResizeEvent(arrowRef);
	const buttonMarginWallPercentage = useMemo<number>(() => ((buttonSize.width / 2) / timelineWidth) * 100, [buttonSize.width, timelineWidth]);
	const arrowMarginWallPercentage = useMemo<number>(() => ((arrowSize.width / 2) / timelineWidth) * 100, [arrowSize.width, timelineWidth]);

	if (!videoData.isVideoPage) {
		return <></>;
	}

	const offsetPercentage = Math.max(buttonMarginWallPercentage, Math.min(100 - buttonMarginWallPercentage, timestamp.time / videoData.data.length * 100));
	const arrowOffsetPercentage = Math.max(arrowMarginWallPercentage, Math.min(100 - arrowMarginWallPercentage, timestamp.time / videoData.data.length * 100));

	const rawPixelsAlong = Math.min(1, (timestamp.time / videoData.data.length)) * timelineWidth;
	const spaceRemainingRight = Math.max((timelineWidth - (rawPixelsAlong)) - (arrowSize.width / 2), 0);
	const spaceRemainingLeft = Math.max(rawPixelsAlong - (arrowSize.width / 2), 0);

	return (
		<div className="timeline-box-outer">
			<button
				className="timeline-box-inner"
				onClick={() => setCurrentTime(timestamp.time)}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				style={{
					left: `${offsetPercentage}%`,
					borderBottomRightRadius: `${Math.min(6, spaceRemainingRight)}px`,
					borderBottomLeftRadius: `${Math.min(6, spaceRemainingLeft)}px`
				}}
				ref={buttonRef}>
					<p className="timeline-inner-text">{hover ? timestamp.message : secondTime}</p>
			</button>
			<div className="arrow-icon-container" style={{ left: `${arrowOffsetPercentage}%` }} ref={arrowRef}>
				<IconContainer asset={ArrowDown}/>
			</div>
		</div>
	)
}
