import { useState } from "react";
import SubtleExpander from "./../../SubtleExpander/SubtleExpander.jsx"
import VideoTimestamp from  "./../VideoTimestamp/VideoTimestamp.jsx"
import VideoCard from "./../VideoCard/VideoCard.jsx"
import { Timestamp, Video } from "./../../../lib/user/user-data.ts"
import { useSelector, useDispatch } from "react-redux"
import { addVideo, updateVideo } from "./../../../features/videos/videoSlice.js"
import "./VideoTimestampList.css"

export interface IVideoTimestampListProperties {
	videoID: string,
	timestamps: Array<Timestamp>
}

export function VideoTimestampList({ videoID, timestamps }: IVideoTimestampListProperties): React.ReactNode {
	const dispatch = useDispatch();

	const onChange = (oldTimestamp: Timestamp, newTimestamp: Timestamp) => {
		let updatedTimestamps: Array<Timestamp> = [ ...timestamps ];

		for (let i = 0; i < updatedTimestamps.length; i++) {
			if (updatedTimestamps[i].time == oldTimestamp.time) {
				updatedTimestamps[i] = newTimestamp;
			}
		}

		let updatedVideo: Video = {
			"videoID": videoID,
			"timestamps": updatedTimestamps
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
				</SubtleExpander>
			</div>
			<hr className="video-timestamp-list-separator"></hr>
		</>
	)
}

export default VideoTimestampList;
