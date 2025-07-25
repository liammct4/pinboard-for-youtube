/// <reference types="vite-plugin-svgr/client" />

import { useContext } from "react";
import { IVideoItemContext, VideoItemContext } from "../VideoItem";
import { VideoThumbnail } from "../../VideoThumbnail/VideoThumbnail";
import PlayIcon from "./../../../../../assets/icons/jump_icon.svg?react";
import PlusIcon from "./../../../../../assets/symbols/plus.svg?react";
import "./RegularVideoItem.css";
import { useVideoInfo } from "../../../features/useVideoInfo";
import { IconContainer } from "../../../images/svgAsset";
import { getYouTubeLinkFromVideoID } from "../../../../lib/util/youtube/youtubeUtil";
import { TimestampList } from "../../timestamps/TimestampList/TimestampList";
import { LabeledArrowExpander } from "../../../presentation/LabeledArrowExpander/LabeledArrowExpander";
import { SmallButton } from "../../../interactive/buttons/SmallButton/SmallButton";
import { createTimestamp } from "../../../../lib/video/video";
import { LinkText } from "../../../interactive/LinkText/LinkText";

export function RegularVideoItem(): React.ReactNode {
	const { video, onTimestampAdded, onTimestampChanged, setTimestamps, expanded, setExpanded } = useContext<IVideoItemContext>(VideoItemContext);
	const { video: videoInfo } = useVideoInfo(video.id);

	let linkResult = getYouTubeLinkFromVideoID(video.id);

	return (
		<div className="regular-video-item">
			<div className="video-info-area">
				<VideoThumbnail className="video-thumbnail" videoID={video.id} alt=""/>
				<SmallButton square onClick={() => {
						if (linkResult.success) {
							window.open(linkResult.result);
						}
					}}>
					<IconContainer className="icon-colour-standard" asset={PlayIcon} use-fill/>
				</SmallButton>
				<span className="video-title">{videoInfo?.title}</span>
				<LinkText href={videoInfo?.author_url}>{videoInfo?.author_name}</LinkText>
			</div>
			<LabeledArrowExpander
				className="timestamp-expander"
				closeMessage="Expand timestamps"
				openMessage="Collapse timestamps"
				expanded={expanded}
				onExpanded={setExpanded}>
					<>
						<TimestampList
							videoID={video.id}
							onTimestampChanged={onTimestampChanged}
							onTimestampsChanged={setTimestamps}
							timestamps={video.timestamps}/>
						<SmallButton circle onClick={() => {
							onTimestampAdded({ id: createTimestamp(), message: "New timestamp", time: 60 });
						}}>
							<IconContainer className="icon-colour-standard" asset={PlusIcon} use-stroke/>
						</SmallButton>
					</>
			</LabeledArrowExpander>
		</div>
	)
}
