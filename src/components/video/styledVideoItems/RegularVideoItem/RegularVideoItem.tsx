/// <reference types="vite-plugin-svgr/client" />

import { useContext, useState } from "react";
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

export function RegularVideoItem(): React.ReactNode {
	const { video, onTimestampAdded, onTimestampChanged, setTimestamps, expanded, setExpanded } = useContext<IVideoItemContext>(VideoItemContext);
	const { video: videoInfo } = useVideoInfo(video.id);

	return (
		<div className="regular-video-item">
			<div className="video-info-area">
				<VideoThumbnail className="video-thumbnail" videoID={video.id} alt=""/>
				<button className="link-button button-base square-button button-small" onClick={() => window.open(getYouTubeLinkFromVideoID(video.id))}>
					<IconContainer className="icon-colour-standard" asset={PlayIcon} use-fill/>
				</button>
				<span className="video-title">{videoInfo?.title}</span>
				<a className="link-text video-channel" href={videoInfo?.author_url}>{videoInfo?.author_name}</a>
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
						<button className="button-base circle-button" onClick={() => {
							onTimestampAdded({ id: crypto.randomUUID(), message: "New timestamp", time: 60 });
						}}>
							<IconContainer className="icon-colour-standard" asset={PlusIcon} use-stroke/>
						</button>
					</>
			</LabeledArrowExpander>
		</div>
	)
}
