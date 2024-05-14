import { useContext } from "react";
import { VideoContext, VideoListContext } from "../../../context/video.ts";
import { Video } from "../../../lib/video/video.ts";
import { Reorder } from "framer-motion";
import VideoTimestampList from "./../VideoTimestampList/VideoTimestampList.jsx"
import "./VideoCollection.css"

export interface IVideoCollectionProperties {
	onReorder: (reordered: Video[]) => void;
}

export function VideoCollection({ onReorder }: IVideoCollectionProperties): React.ReactNode {
	const collection = useContext(VideoListContext);
	
	return (
		<Reorder.Group layoutScroll className="timestamp-scrollbox-list" values={collection.videos} onReorder={onReorder}>
			{collection.videos.map(x =>
				<VideoContext.Provider key={x.videoID} value={x}>
					<VideoTimestampList></VideoTimestampList>
				</VideoContext.Provider>
			)}
		</Reorder.Group>
	)
}

export default VideoCollection;
