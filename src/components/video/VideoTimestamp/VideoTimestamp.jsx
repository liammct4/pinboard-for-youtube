import { useState} from "react"
import { getSecondsFromTimestamp, getTimestampFromSeconds } from "./../../../lib/util/time-util.js"
import * as YTUtil from "./../../../lib/youtube-util.js" 
import "./VideoTimestamp.css"

/* "time" is in seconds, not a timestamp. So 1032 instead of 17:12 for example. */
/* TODO: Implement ability to edit timestamps using the edit button. */
export function VideoTimestamp({ "video-id": videoID, "message": message, "time": time }) {
	let [seconds, setSeconds] = useState(Number(time));

	let stringTime = getTimestampFromSeconds(seconds);
	let timeLink = YTUtil.getTimestampVideoLinkFromSeconds(videoID, seconds);

	return (
		<div id="video-timestamp-inner">
			<a id="video-timestamp-time" href={timeLink}>{stringTime}</a>
			<div id="video-timestamp-separator"></div>
			<p id="video-timestamp-message">{message}</p>
			<div id="video-timestamp-filler"></div>
			<button id="video-timestamp-button" className="button-small">Edit</button>
		</div>
	);
}

export default VideoTimestamp;
