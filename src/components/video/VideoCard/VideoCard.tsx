import * as YTUtil from "./../../../lib/util/youtube/youtubeUtil.ts"
import { ReactComponent as ThumbnailMissingImage } from "./../../../../assets/thumb_missing.svg"
import "./VideoCard.css"

export interface IVideoCardProperties {
	className?: string;
	videoID: string | undefined;
	placeholderTitle?: string;
}

export function VideoCard({ className = "", videoID, placeholderTitle = "" }: IVideoCardProperties): React.ReactNode {
	let videoExists: boolean = true;
	let url: string | null = null;
	let info: any | null = null;

	if (videoID == undefined || !YTUtil.videoExists(YTUtil.getYouTubeLinkFromVideoID(videoID))) {
		videoExists = false;
	}
	else {
		url = YTUtil.getYouTubeLinkFromVideoID(videoID);
		info = YTUtil.getYoutubeVideoInfoFromVideoID(videoID);
	}

	return (
		<div className={`video-card-box ${className.trim()}`}>
			{videoExists ? 
				<>
					<img className="thumbnail-image" src={`https://img.youtube.com/vi/${videoID}/default.jpg`} alt={`The thumbnail for the video titled '${info["title"]}'.`}/>
					<h2 className="video-title">{info["title"]}</h2>
					<a className="link-text video-link" href={url!}>{url}</a>
				</>
				:
				<>
					<ThumbnailMissingImage className="thumbnail-image" preserveAspectRatio="none" width={undefined} height={undefined}/>
					<h2 className="video-title">{placeholderTitle}</h2>
				</>
			}
		</div>
	)
}

export default VideoCard;
