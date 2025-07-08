/// <reference types="vite-plugin-svgr/client" />

import { useContext, useState } from "react";
import { useVideoInfo } from "../../../features/useVideoInfo";
import { LabeledArrowExpander } from "../../../presentation/LabeledArrowExpander/LabeledArrowExpander";
import PlusIcon from "./../../../../../assets/symbols/plus.svg?react"
import PlayIcon from "./../../../../../assets/icons/jump_icon.svg?react"
import { IconContainer } from "../../../images/svgAsset";
import { IVideoItemContext, VideoItemContext } from "../VideoItem";
import { getYouTubeLinkFromVideoID, getYoutubeVideoInfoFromLink } from "../../../../lib/util/youtube/youtubeUtil";
import { TimestampList } from "../../timestamps/TimestampList/TimestampList";
import "./MinimalVideoItem.css"
import { SmallButton } from "../../../interactive/buttons/SmallButton/SmallButton";
import { createTimestamp } from "../../../../lib/video/video";

export function MinimalVideoItem(): React.ReactNode {
	const { video, onTimestampAdded, onTimestampChanged, setTimestamps, expanded, setExpanded } = useContext<IVideoItemContext>(VideoItemContext);
	const { video: videoInfo } = useVideoInfo(video.id);

	return (
		<div className="compact-video-item-outer">
			<LabeledArrowExpander
				openMessage={videoInfo?.title ?? ""}
				closeMessage={videoInfo?.title ?? ""}
				expanded={expanded}
				onExpanded={setExpanded}>
				<div className="compact-video-item-inner">
					<TimestampList
						videoID={video.id}
						timestamps={video.timestamps}
						onTimestampChanged={onTimestampChanged}
						onTimestampsChanged={setTimestamps}
					/>
					<SmallButton circle onClick={() => {
						onTimestampAdded({ id: createTimestamp(), message: "New timestamp", time: 60 });
					}}>
						<IconContainer className="icon-colour-standard" asset={PlusIcon} use-stroke/>
					</SmallButton>
				</div>
			</LabeledArrowExpander>
			<SmallButton square onClick={() => window.open(getYouTubeLinkFromVideoID(video.id))}>
				<IconContainer className="icon-colour-standard" asset={PlayIcon} use-fill/>
			</SmallButton>
		</div>
	);
}
