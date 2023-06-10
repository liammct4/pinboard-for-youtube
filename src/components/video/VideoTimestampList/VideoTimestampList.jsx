import { useState } from "react";
import SubtleExpander from "./../../SubtleExpander/SubtleExpander.jsx"
import VideoTimestamp from  "./../VideoTimestamp/VideoTimestamp.jsx"
import VideoCard from "./../VideoCard/VideoCard.jsx"
import "./VideoTimestampList.css"

export function VideoTimestampList({ "video-id": videoID, timestamps }) {
	const [times, setTimes] = useState(timestamps ?? []);

	/* Structure of "timestamps", which is a JSON array of objects:
		"timestamps": [
			{ "time": 103, "message": "Test message" },
			{ "time": 493, "message": "Another message" },
			{ "time": 1304, "message": "Third message" },
		]
	*/

	let timestampItems = times.map((x) => <li><VideoTimestamp video-id={videoID} time={x.time} message={x.message}></VideoTimestamp></li>);

	return (
		<>
			<div id="video-timestamp-list">
				<VideoCard video-id={videoID}></VideoCard>
				<hr className="video-timestamp-list-margin"></hr>
				<SubtleExpander open-message="Close timestamps" close-message="Expand timestamps">	
					<ul className="video-timestamp-list-container">
						{timestampItems}
					</ul>
				</SubtleExpander>
			</div>
			<hr className="video-timestamp-list-separator"></hr>
		</>
	)
}

export default VideoTimestampList;
