import { useState, useRef, useEffect } from "react"
import { getSecondsFromTimestamp, getTimestampFromSeconds } from "./../../../lib/util/time-util.js"
import * as YTUtil from "./../../../lib/youtube-util.js" 
import { Timestamp } from "./../../../lib/user/user-data.ts"
import { v4 as uuidv4 } from "uuid";
import "./VideoTimestamp.css"

export interface IVideoTimestampProperties {
	videoID: string,
	timestamp: Timestamp
}

/* "time" is in seconds, not a timestamp. So 1032 instead of 17:12 for example. */
export function VideoTimestamp({ videoID, timestamp }: IVideoTimestampProperties): React.ReactNode {
	const [seconds, setSeconds] = useState(Number(timestamp.time));
	const [message, setMessage] = useState(timestamp.message);

	let timeRef = useRef(getTimestampFromSeconds(seconds));
	let messageRef = useRef(message);

	let stringTime: string = getTimestampFromSeconds(seconds);
	let timeLink: string = YTUtil.getTimestampVideoLinkFromSeconds(videoID, seconds);
	
	// Set a unique ID for Bootstrap components as to not interfere with other VideoTimestamp components in the DOM.
	let uniqueID: string = "vtl-" + uuidv4();

	const onSave = () => {
		// TODO: Add error handling.
		let time: number = getSecondsFromTimestamp(timeRef.current);

		setMessage(messageRef.current);
		setSeconds(time);
	}

	return (
		<div className="video-timestamp-inner">
			<a className="video-timestamp-time" href={timeLink}>{stringTime}</a>
			<div className="video-timestamp-separator"></div>
			<p className="video-timestamp-message">{message}</p>
			<div className="video-timestamp-filler"></div>
			<button className="button-small video-timestamp-button" data-bs-toggle="modal" data-bs-target={"#" + uniqueID}>Edit</button>
			{/* Edit modal */}
			<div className="modal fade" id={uniqueID} role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Edit timestamp</h5>
							<button type="button" title="Close" className="circle-button modal-close-button" data-bs-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<div className="edit-grid">
								{/* Time */}
								<h6>Time:</h6>
								<input onChange={(x) => timeRef.current = x.target.value} defaultValue={stringTime}></input>
								{/* Message */}
								<h6>Message:</h6>
								<input onChange={(x) => messageRef.current = x.target.value} defaultValue={message}></input>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="button-small" onClick={onSave}>Save</button>
							<button type="button" className="button-small" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VideoTimestamp;
