import { useState } from "react";
import { useVideoInfo } from "../../../features/useVideoInfo";
import { LabeledArrowExpander } from "../../../presentation/LabeledArrowExpander/LabeledArrowExpander";
import { IVideoItemProperties } from "../VideoItem";
import { VideoTimestamp } from "../../VideoTimestamp/VideoTimestamp";
import { Timestamp } from "../../../../lib/video/video";

export function CompactVideoItem({ video }: IVideoItemProperties): React.ReactNode {
	const { video: videoInfo } = useVideoInfo(video.id);
	const [ isExpanded, setIsExpanded ] = useState<boolean>(false);

	const onTimestampChanged = (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => {
		// TODO.
	}

	return (
		<>
			<LabeledArrowExpander
				openMessage={videoInfo?.title ?? ""}
				closeMessage={videoInfo?.title ?? ""}
				expanded={isExpanded}
				onExpanded={setIsExpanded}>
				{
					video.timestamps.map(x => <VideoTimestamp key={x.id} videoID={video.id} timestamp={x} onChange={onTimestampChanged}/>)
				}
			</LabeledArrowExpander>
		</>
	);
}
