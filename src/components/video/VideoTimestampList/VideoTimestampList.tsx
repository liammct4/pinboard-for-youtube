import { useState, useRef } from "react";
import SubtleExpander from "./../../SubtleExpander/SubtleExpander.jsx"
import VideoTimestamp from  "./../VideoTimestamp/VideoTimestamp.jsx"
import VideoCard from "./../VideoCard/VideoCard.jsx"
import { Timestamp, Video, generateTimestamp } from "../../../lib/video/video.ts";
import { useSelector, useDispatch } from "react-redux"
import { addVideo, updateVideo } from "./../../../features/videos/videoSlice.js"
import { generateUniqueFrom } from "./../../../lib/util/random-util.ts"
import { RootState, store } from "../../../app/store.ts";
import Plus from "src/../assets/symbols/plus.svg"
import "./VideoTimestampList.css"
import { addExpandedID, removeExpandedID } from "../../../features/state/tempStateSlice.ts";

export interface IVideoTimestampListProperties {
	video: Video;
}

export function VideoTimestampList({ video }: IVideoTimestampListProperties): React.ReactNode {
	const dispatch = useDispatch();
	let openVideos = useSelector((state: RootState) => state.tempState.expandedVideoIDs);

	const onChange = (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => {
		let videoTimestamps = store.getState().video.currentVideos.find(x => x.videoID == video.videoID)?.timestamps;
		let updatedTimestamps: Array<Timestamp> = [ ...videoTimestamps! ];

		if (newTimestamp == null) {
			// The timestamp has been deleted.
			let index = updatedTimestamps.findIndex(x => x.id == oldTimestamp.id);
			updatedTimestamps.splice(index, 1);
		}
		else {
			for (let i = 0; i < updatedTimestamps.length; i++) {
				if (updatedTimestamps[i].id == oldTimestamp.id) {
					updatedTimestamps[i] = newTimestamp;
					break;
				}
			}
		}

		let updatedVideo: Video = {
			"videoID": video.videoID,
			"timestamps": updatedTimestamps
		}
		
		dispatch(updateVideo(updatedVideo));
	}

	const onAddTimestamp: () => void = () => {
		let newTime = generateUniqueFrom(video.timestamps, (x) => x.time, 86400);
		let updatedVideo: Video = {
			"videoID": video.videoID,
			"timestamps": [
				...video.timestamps,
				generateTimestamp(newTime!, "New Timestamp")
			]
		}
		
		dispatch(updateVideo(updatedVideo));
	}

	const handleExpanded = (open: boolean) => {
		if (open) {
			dispatch(addExpandedID(video.videoID));
			return;
		}

		dispatch(removeExpandedID(video.videoID));
	} 

	let isOpen = openVideos.includes(video.videoID);
	let timestampItems: Array<JSX.Element> = video.timestamps.map((x) => <li key={x.id}><VideoTimestamp videoID={video.videoID} timestamp={x} onChange={onChange}></VideoTimestamp></li>);

	return (
		<>
			<div className="video-timestamp-list">
				<VideoCard videoID={video.videoID}/>
				<hr className="video-timestamp-list-margin"></hr>
				<SubtleExpander expanded={isOpen} onExpanded={handleExpanded} openMessage="Close timestamps" closeMessage="Expand timestamps">	
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
