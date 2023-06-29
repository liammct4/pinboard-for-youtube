import { useState, useRef, useEffect, MutableRefObject } from "react"
import { getSecondsFromTimestamp, getTimestampFromSeconds } from "./../../../lib/util/time-util.js"
import * as YTUtil from "./../../../lib/youtube-util.js" 
import { Timestamp } from "./../../../lib/user/user-data.ts"
import { v4 as uuidv4 } from "uuid";
import "./VideoTimestamp.css"

export interface IVideoTimestampProperties {
	videoID: string,
	timestamp: Timestamp,
	onChange: (oldTimestamp: Timestamp, newTimestamp: Timestamp) => void,
}

/* "time" is in seconds, not a timestamp. So 1032 seconds total instead of 17:12 for example. */
export function VideoTimestamp({ videoID, timestamp, onChange }: IVideoTimestampProperties): React.ReactNode {
	let timeRef: MutableRefObject<string> = useRef(getTimestampFromSeconds(timestamp.time));
	let messageRef: MutableRefObject<string> = useRef(timestamp.message);
	let uniqueID: MutableRefObject<string> = useRef("vtl-" + uuidv4());

	// Set a unique ID for Bootstrap components as to not interfere with other VideoTimestamp components in the DOM.
	
	const onSave = () => {
		// TODO:
		// - Add error handling.
		// - Elminiate useRef with input fields.
		let inputTime: number = getSecondsFromTimestamp(timeRef.current);

		onChange(timestamp, { "time": inputTime, "message": messageRef.current });
	}
	
	let stringTime: string = getTimestampFromSeconds(timestamp.time);
	let timeLink: string = YTUtil.getTimestampVideoLinkFromSeconds(videoID, timestamp.time);

	return (
		<div className="video-timestamp-inner">
			<a className="video-timestamp-time" href={timeLink}>{stringTime}</a>
			<div className="video-timestamp-separator"></div>
			<p className="video-timestamp-message">{timestamp.message}</p>
			<div className="video-timestamp-filler"></div>
			<button className="button-small video-timestamp-button" data-bs-toggle="modal" data-bs-target={"#" + uniqueID.current}>Edit</button>
			{/* Edit modal */}
			<div className="modal fade" id={uniqueID.current} role="dialog">
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
								<input onChange={(x) => messageRef.current = x.target.value} defaultValue={timestamp.message}></input>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="button-small" onClick={onSave} data-bs-dismiss="modal">Save</button>
							<button type="button" className="button-small" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VideoTimestamp;
