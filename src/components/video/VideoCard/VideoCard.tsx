import { VideoThumbnail } from "../VideoThumbnail/VideoThumbnail.tsx";
import { useVideoInfo } from "../../features/useVideoInfo.ts";
import "./VideoCard.css"

export interface IVideoCardProperties {
	className?: string;
	videoID: string | undefined;
	placeholderTitle?: string;
	showLink?: boolean;
}

export function VideoCard({
		className = "",
		videoID,
		placeholderTitle = "",
		showLink = true
	}: IVideoCardProperties): React.ReactNode {
	const { videoExists, info, url } = useVideoInfo(videoID);

	return (
		<div className={`video-card-box ${className.trim()}`}>
			<VideoThumbnail
				videoID={videoID!}
				alt={videoExists ? `The thumbnail for the video titled '${info["title"]}'.` : ""}/>
			<h2 className="video-title">{videoExists ? info["title"] : placeholderTitle}</h2>
			{showLink && videoExists ? <a className="link-text video-link" href={url!}>{url}</a> : <></>}
		</div>
	)
}
