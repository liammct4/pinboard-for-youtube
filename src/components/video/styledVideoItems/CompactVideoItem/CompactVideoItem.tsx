import { useContext, useState } from "react";
import { IVideoItemContext, VideoItemContext } from "../VideoItem";
import { VideoThumbnail } from "../../VideoThumbnail/VideoThumbnail";
import { useVideoInfo } from "../../../features/useVideoInfo";
import PlayIcon from "./../../../../../assets/icons/jump_icon.svg?react"
import PlusIcon from "./../../../../../assets/symbols/plus.svg?react"
import "./CompactVideoItem.css"
import { LabeledArrowExpander } from "../../../presentation/LabeledArrowExpander/LabeledArrowExpander";
import { TimestampList } from "../../timestamps/TimestampList/TimestampList";
import { IconContainer } from "../../../images/svgAsset";
import { getYouTubeLinkFromVideoID } from "../../../../lib/util/youtube/youtubeUtil";
import { SmallButton } from "../../../interactive/buttons/SmallButton/SmallButton";

export function CompactVideoItem(): React.ReactNode {
	const { video, onTimestampAdded, onTimestampChanged, setTimestamps, expanded, setExpanded } = useContext<IVideoItemContext>(VideoItemContext);
	const { video: videoInfo, videoExists } = useVideoInfo(video.id);

	return (
		<div className="compact-video-item">
			<VideoThumbnail
				videoID={video.id}
				alt={videoExists ? `The thumbnail for the video titled '${videoInfo?.title}'.` : "A blank thumbnail image."}
				width={50}/>
			<span>{videoInfo?.title}</span>
			<SmallButton square onClick={() => window.open(getYouTubeLinkFromVideoID(video.id))}>
				<IconContainer className="icon-colour-standard" asset={PlayIcon} use-fill/>
			</SmallButton>
			<LabeledArrowExpander
				className="timestamp-expander"
				openMessage="Collapse timestamps"
				closeMessage="Expand timestamps"
				expanded={expanded}
				onExpanded={setExpanded}>
					<>
						<TimestampList
							videoID={video.id}
							timestamps={video.timestamps}
							onTimestampChanged={onTimestampChanged}
							onTimestampsChanged={setTimestamps}/>
						<SmallButton circle onClick={() => {
							onTimestampAdded({ id: crypto.randomUUID(), message: "New timestamp", time: 60 });
						}}>
							<IconContainer className="icon-colour-standard" asset={PlusIcon} use-stroke/>
						</SmallButton>
					</>
			</LabeledArrowExpander>
		</div>
	);
}
