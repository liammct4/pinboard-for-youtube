import * as YTUtil from "./../../../lib/util/youtube/youtubeUtil.ts"
import ThumbMissing from "./../../../../assets/thumb_missing.svg"
import "./VideoCard.css"

export interface IVideoCardProperties {
	videoID: string | undefined;
	placeholderTitle?: string;
}

export function VideoCard({ videoID, placeholderTitle = "" }: IVideoCardProperties): React.ReactNode {
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
		<div className="video-card-inner">
			{videoExists ? 
				<>
					<img className="video-card-thumb" src={`https://img.youtube.com/vi/${videoID}/default.jpg`} alt={`The thumbnail for the video titled '${info["title"]}'.`}/>
					<h2 className="video-card-title">{info["title"]}</h2>
					<a className="video-card-url" href={url!}>{url}</a>
				</>
				:
				<>
					<img className="video-card-thumb" src={ThumbMissing} alt="Placeholder thumbnail with a grey YouTube button as the video does not exist."/>
					<h2 className="video-card-title">{placeholderTitle}</h2>
				</>
			}
		</div>
	)
}

export default VideoCard;
