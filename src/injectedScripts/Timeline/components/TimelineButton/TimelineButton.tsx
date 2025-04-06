import { useMemo, useRef, useState } from "react";
import { Timestamp } from "../../../../lib/video/video"
import { getTimestampFromSeconds } from "../../../../lib/util/generic/timeUtil";
import { useLocalVideoData } from "../../../features/useLocalVideoData";
import { IconContainer } from "../../../../components/images/svgAsset";
import ArrowDown from "./../../../../../assets/misc/arrow_down_timeline.svg?react"
import { useLocalVideoControls } from "../../../features/useLocalVideoControls";
import { Coordinates, Rect } from "../../../../lib/util/objects/types";
import { useDomEvent } from "../../../features/useDomEvent";
import { useBoundsChangeEvent } from "../../../features/useBoundsChangeEvent";
import "./TimelineButton.css"

export interface ITimelineButtonProperties {
	timestamp: Timestamp;
	timelineBounds: Rect;
}

export function TimelineButton({ timestamp: initT, timelineBounds }: ITimelineButtonProperties) {
	// TODO: Replace.
	const [ timestamp, setTimestamp ] = useState<Timestamp>(initT); 
	const buttonRef = useRef<HTMLButtonElement>(null!);
	const arrowRef = useRef<HTMLDivElement>(null!);
	const videoData = useLocalVideoData();
	const { setCurrentTime } = useLocalVideoControls();
	const secondTimeData = useMemo(() => getTimestampFromSeconds(timestamp.time), [timestamp.time]);
	const [ isDragging, setIsDragging ] = useState<boolean>(false);
	const [ startIsDragging, setStartIsDragging ] = useState<boolean>(false);
	const [ hover, setHover ] = useState<boolean>(false);
	const { size: buttonSize } = useBoundsChangeEvent(buttonRef);
	const { size: arrowSize } = useBoundsChangeEvent(arrowRef);
	const buttonMarginWallPercentage = useMemo<number>(() => ((buttonSize.width / 2) / timelineBounds.size.width) * 100, [buttonSize.width, timelineBounds.size.width]);
	const arrowMarginWallPercentage = useMemo<number>(() => ((arrowSize.width / 2) / timelineBounds.size.width) * 100, [arrowSize.width, timelineBounds.size.width]);
	const [ mousePosition, setMousePosition ] = useState<Coordinates>({ x: 0, y: 0 });
	useDomEvent("mouseup", () => {
		if (!videoData.isVideoPage) {
			console.error("No video page.");
			return;
		}

		if (isDragging) {
			let multiplier = (mousePosition.x - timelineBounds.position.x) / (timelineBounds.size.width);
			let secondLength = Math.round(multiplier * videoData.data.length);

			if (secondLength != timestamp.time) {
				setTimestamp({ ...timestamp, time: secondLength });
			}
		}

		setStartIsDragging(false);
		setIsDragging(false);
	});
	useDomEvent<"mousemove">("mousemove", (e) => {
		if (isDragging) {
			setMousePosition({
				x: e.x,
				y: e.y
			});
		}
	})

	if (!videoData.isVideoPage) {
		return <></>;
	}

	let percentage: number;
	let secondTime: string = secondTimeData;
	
	if (isDragging) {
		let multiplierAlongTimeline = Math.min(1, Math.max(0, (mousePosition.x - timelineBounds.position.x) / (timelineBounds.size.width)));
		let secondTimeMouse = Math.round(multiplierAlongTimeline * videoData.data.length);

		percentage = secondTimeMouse / videoData.data.length;
		secondTime = getTimestampFromSeconds(secondTimeMouse);
	}
	else {
		percentage = timestamp.time / videoData.data.length;
	}

	const offsetPercentage = Math.max(buttonMarginWallPercentage, Math.min(100 - buttonMarginWallPercentage, percentage * 100));
	const arrowOffsetPercentage = Math.max(arrowMarginWallPercentage, Math.min(100 - arrowMarginWallPercentage, percentage * 100));

	const rawPixelsAlong = Math.min(1, percentage) * timelineBounds.size.width;
	const spaceRemainingRight = Math.max((timelineBounds.size.width - (rawPixelsAlong)) - (arrowSize.width / 2), 0);
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
				onMouseDown={() => setStartIsDragging(true)}
				onMouseMove={() => {
					if (startIsDragging) {
						setIsDragging(true)
					}
				}}
				ref={buttonRef}>
					<p className="timeline-inner-text">{hover && !isDragging ? timestamp.message : secondTime}</p>
			</button>
			<div className="arrow-icon-container" style={{ left: `${arrowOffsetPercentage}%` }} ref={arrowRef}>
				<IconContainer asset={ArrowDown}/>
			</div>
		</div>
	)
}
