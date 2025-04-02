import { useMemo, useState } from "react";
import { Timestamp } from "../../../../lib/video/video"
import { getTimestampFromSeconds } from "../../../../lib/util/generic/timeUtil";
import { useLocalVideoData } from "../../../features/useLocalVideoData";
import { IconContainer } from "../../../../components/images/svgAsset";
import ArrowDown from "./../../../../../assets/misc/arrow_down_timeline.svg?react"
import "./TimelineButton.css"

export interface ITimelineButtonProperties {
	timestamp: Timestamp;
}

export function TimelineButton({ timestamp }: ITimelineButtonProperties) {
	const videoData = useLocalVideoData();
	const secondTime = useMemo(() => getTimestampFromSeconds(timestamp.time), [timestamp.time]);
	const [ hover, setHover ] = useState<boolean>(false);

	if (!videoData.isVideoPage) {
		return <></>;
	}

	const offsetPercentage = Math.min(100, timestamp.time / videoData.data.length * 100);

	return (
		<div className="timeline-box-outer">
			<button
				className="timeline-box-inner"
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				style={{ left: `${offsetPercentage}%` }}>
					<p className="timeline-inner-text">{hover ? timestamp.message : secondTime}</p>
			</button>
			<div className="arrow-icon-container" style={{ left: `${offsetPercentage}%` }}>
				<IconContainer asset={ArrowDown}/>
			</div>
		</div>
	)
}
