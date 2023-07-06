import logo from "./../../../../assets/logo/logo.png"
import * as YTUtil from "./../../../lib/youtube-util.js"
import * as request from "./../../../lib/request.js"
import "./VideoCard.css"

export interface IVideoCardProperties {
	videoID: string
}

export function VideoCard({ videoID }: IVideoCardProperties): React.ReactNode {
	let url: string = YTUtil.getYouTubeLinkFromVideoID(videoID);
	let info: any = YTUtil.getYoutubeVideoInfoFromVideoID(videoID);

	return (
		<div className="video-card-inner">
			<img className="video-card-thumb" src={`https://img.youtube.com/vi/${videoID}/default.jpg`}/>
			<h2 className="video-card-title">{info["title"]}</h2>
			<a className="video-card-url" href={url}>{url}</a>
		</div>
	)
}

export default VideoCard;
