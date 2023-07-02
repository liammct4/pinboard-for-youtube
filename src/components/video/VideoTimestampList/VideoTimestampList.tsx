import { useState, useRef } from "react";
import SubtleExpander from "./../../SubtleExpander/SubtleExpander.jsx"
import VideoTimestamp from  "./../VideoTimestamp/VideoTimestamp.jsx"
import VideoCard from "./../VideoCard/VideoCard.jsx"
import { Timestamp, Video } from "./../../../lib/user/user-data.ts"
import { useSelector, useDispatch } from "react-redux"
import { addVideo, updateVideo } from "./../../../features/videos/videoSlice.js"
import { generateUniqueFrom } from "./../../../lib/util/random-util.ts"
import Plus from "src/../assets/symbols/plus.svg"
import "./VideoTimestampList.css"

export interface IVideoTimestampListProperties {
	videoID: string,
	timestamps: Array<Timestamp>
}

export function VideoTimestampList({ videoID, timestamps }: IVideoTimestampListProperties): React.ReactNode {
	const dispatch = useDispatch();

	const onChange = (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => {
		let updatedTimestamps: Array<Timestamp> = [ ...timestamps ];
		
		if (newTimestamp == null) {
			// The timestamp has been deleted.
			let index = updatedTimestamps.findIndex(x => x.time == oldTimestamp.time);
			updatedTimestamps.splice(index, 1);
		}
		else {
			for (let i = 0; i < updatedTimestamps.length; i++) {
				if (updatedTimestamps[i].time == oldTimestamp.time) {
					updatedTimestamps[i] = newTimestamp;
				}
			}
		}

		let updatedVideo: Video = {
			"videoID": videoID,
			"timestamps": updatedTimestamps
		}

		dispatch(updateVideo(updatedVideo));
	}

	const onAddTimestamp: () => void = () => {
		let newTime = generateUniqueFrom(timestamps, (x) => x.time, 86400);
		let updatedVideo: Video = {
			"videoID": videoID,
			"timestamps": [
				...timestamps,
				{ "time": newTime!, "message": "New Timestamp" }
			]
		}
		
		dispatch(updateVideo(updatedVideo));
	}

	let timestampItems: Array<JSX.Element> = timestamps.map((x) => <li key={x.time}><VideoTimestamp videoID={videoID} timestamp={x} onChange={onChange}></VideoTimestamp></li>);

	return (
		<>
			<div className="video-timestamp-list">
				<VideoCard videoID={videoID}/>
				<hr className="video-timestamp-list-margin"></hr>
				<SubtleExpander openMessage="Close timestamps" closeMessage="Expand timestamps">	
					<ul className="video-timestamp-list-container">
						{timestampItems}
					</ul>
					<div className="add-timestamp-button-outer">
						<p className="add-timestamp-fake-time">00:00</p>
						<div style={{ flexGrow: "1" }}></div>
						<button
							className="add-timestamp-button circle-button"
							onClick={onAddTimestamp}>
							<img src={Plus}></img>
						</button>
						<p className="add-timestamp-text">Add new timestamp</p>
					</div>
				</SubtleExpander>
			</div>
			<hr className="video-timestamp-list-separator"></hr>
		</>
	)
}

export default VideoTimestampList;
