import logo from "./../../../../assets/logo/logo.png"
import * as YTUtil from "./../../../lib/youtube-util.js"
import * as request from "./../../../lib/request.js"
import "./VideoCard.css"

export function VideoCard({ "video-id": videoID }) {
	let url = YTUtil.getYouTubeLinkFromVideoID(videoID);
	let info = JSON.parse(request.requestGet(`https://noembed.com/embed?url=${url}`))

	return (
		<div className="video-card-inner">
			<img id="video-card-thumb" src={`https://img.youtube.com/vi/${videoID}/default.jpg`}/>
			<h2 id="video-card-title">{info["title"]}</h2>
			<a id="video-card-url" href={url}>{url}</a>
		</div>
	)
}

export default VideoCard;
