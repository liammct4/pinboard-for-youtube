import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Timestamp } from "../../../../lib/video/video"
import { getTimestampFromSeconds } from "../../../../lib/util/generic/timeUtil";
import { IconContainer } from "../../../../components/images/svgAsset";
import ArrowDown from "./../../../../../assets/misc/arrow_down_timeline.svg?react"
import PausedIcon from "./../../../../../assets/icons/jump_icon.svg?react"
import PlayIcon from "./../../../../../assets/icons/play.svg?react"
import { useLocalVideoControls } from "../../../features/useLocalVideoControls";
import { Coordinates, Rect } from "../../../../lib/util/objects/types";
import { useDomEvent } from "../../../features/useDomEvent";
import { useBoundsChangeEvent } from "../../../features/useBoundsChangeEvent";
import "./TimelineButton.css"
import { useTextMeasurer } from "../../../../components/features/useTextMeasurer";
import { LocalVideoDataContext } from "../../../features/LocalVideoDataWrapper";

export interface ITimelineButtonProperties {
	timestamp: Timestamp;
	timelineBounds: Rect;
	isAutoplayButton: boolean;
	onChange?: (newTimestamp: Timestamp) => void;
	activeHover: string | null;
	onHoverChanged: (hover: string | null) => void;
}

export function TimelineButton({ timestamp, timelineBounds, isAutoplayButton, onChange, activeHover, onHoverChanged }: ITimelineButtonProperties) {
	const buttonRef = useRef<HTMLButtonElement>(null!);
	const arrowRef = useRef<HTMLDivElement>(null!);
	const arrowImageRef = useRef<SVGSVGElement>(null!);
	const videoData = useContext(LocalVideoDataContext);
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
	const changed = useRef<boolean>(false); 
	const { measureText } = useTextMeasurer();
	useDomEvent("mouseup", () => {
		if (!videoData.isVideoPage) {
			console.error("No video page.");
			return;
		}

		if (isDragging) {
			let multiplier = (mousePosition.x - timelineBounds.position.x) / (timelineBounds.size.width);
			let secondLength = Math.round(multiplier * videoData.data.length);

			if (secondLength != timestamp.time) {
				onChange?.({ ...timestamp, time: secondLength });
				changed.current = true;
			}
			else {
				changed.current = false;
			}
		}
		else {
			changed.current = false;
		}

		setTimeout(() => {
			setStartIsDragging(false);
			setIsDragging(false);
		}, 50);
	});
	useDomEvent<"mousemove">("mousemove", (e) => {
		if (isDragging) {
			setMousePosition({
				x: e.x,
				y: e.y
			});
		}
	});
	
	useEffect(() => {
		if (isAutoplayButton || arrowImageRef.current == null) {
			return;
		}

		let buttonBottom = buttonRef.current.getBoundingClientRect().bottom;
		let arrowTop = arrowImageRef.current.getBoundingClientRect().top;

		let arrowVerticalOffset = (buttonBottom - arrowTop) - 1;
		arrowRef.current.style.setProperty("--arrow-offset-align-distance", `${arrowVerticalOffset}px`);
	}, [arrowImageRef, isAutoplayButton]);

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

	let content: JSX.Element;
	let textWidth: number;

	if (isAutoplayButton) {
		content = <IconContainer
			className="autoplay-icon icon-colour-standard"
			asset={videoData.data.paused ? PausedIcon : PlayIcon}
			use-fill
			use-stroke
			data-active-toggle="true"/>
	}
	else {
		let text = hover && !isDragging ? timestamp.message : secondTime;
		content = <p className="timeline-inner-text">{text}</p>
		textWidth = measureText(text, `9pt "Roboto"`) + 14;
	}

	let mouseEvents: React.HTMLAttributes<HTMLElement> = {
		onClick: () => setTimeout(() => {
			if (!changed.current) {
				setCurrentTime(timestamp.time)
			}
		}, 50),
		onMouseEnter: () => {
			setHover(true);
			document.body.style.setProperty("cursor", "pointer");
			onHoverChanged(timestamp.id);
		},
		onMouseLeave: () => {
			setHover(false);
			document.body.style.removeProperty("cursor");
			onHoverChanged(null);
		},
		onMouseDown: (e) => {
			setStartIsDragging(true);
			setMousePosition({
				x: e.clientX,
				y: e.clientY
			});
		},
		onMouseMove: () => {
			if (startIsDragging) {
				setIsDragging(true)
			}
		}
	}

	return (
		<div className="timeline-box-outer"
			data-hover-highlight={
				activeHover == null ? "none" :
				activeHover == timestamp.id ? "active" :
				"inactive"
			}>
			<div className="box-interaction-area" style={{
				left: `${offsetPercentage}%`,
			}}
			{...mouseEvents}
			data-hover={hover && !isDragging}>
				<button
					className="timeline-box-inner"
					style={{
						width: !isAutoplayButton ? `${textWidth!}px` : undefined,
						borderBottomRightRadius: isAutoplayButton ? undefined : `${Math.min(6, spaceRemainingRight)}px`,
						borderBottomLeftRadius: isAutoplayButton ? undefined : `${Math.min(6, spaceRemainingLeft)}px`
					}}
					ref={buttonRef}
					title={timestamp.message}
					data-active-toggle={isAutoplayButton}
					data-circle={isAutoplayButton}>
						{content}
				</button>
			</div>
			{!isAutoplayButton ?
				<div className="arrow-icon-container" style={{ left: `${arrowOffsetPercentage}%` }} ref={arrowRef} {...mouseEvents} data-hover={hover && !isDragging}>
					<IconContainer ref={arrowImageRef} asset={ArrowDown}/>
				</div>
				: <></>
			}
		</div>
	)
}
