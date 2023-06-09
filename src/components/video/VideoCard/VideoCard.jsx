import logo from "./../../../../assets/logo/logo.png"
import * as ytUtil from "./../../../lib/youtube-util.js"
import * as request from "./../../../lib/request.js"
import "./VideoCard.css"

export function VideoCard({ "video-id": videoId }) {
	let url = ytUtil.getYouTubeLinkFromVideoID(videoId);
	let info = JSON.parse(request.requestGet(`https://noembed.com/embed?url=${url}`))

	return (
		<div className="video-card-inner">
			<img id="video-card-thumb" src={`https://img.youtube.com/vi/${videoId}/default.jpg`}/>
			<h2 id="video-card-title">{info["title"]}</h2>
			<a id="video-card-url" href={url}>{url}</a>
		</div>
	)
}

export default VideoCard;
