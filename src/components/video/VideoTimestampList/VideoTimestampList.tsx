import { useState } from "react";
import SubtleExpander from "./../../SubtleExpander/SubtleExpander.jsx"
import VideoTimestamp from  "./../VideoTimestamp/VideoTimestamp.jsx"
import VideoCard from "./../VideoCard/VideoCard.jsx"
import { Timestamp } from "./../../../lib/user/user-data.ts"
import "./VideoTimestampList.css"

export interface IVideoTimestampListProperties {
	videoID: string,
	timestamps: Array<Timestamp>
}

export function VideoTimestampList({ videoID, timestamps }: IVideoTimestampListProperties): React.ReactNode {
	const [times, setTimes] = useState(timestamps ?? []);

	let timestampItems: Array<JSX.Element> = times.map((x) => <li key={`${videoID}-${x.time}`}><VideoTimestamp videoID={videoID} timestamp={x}></VideoTimestamp></li>);

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
