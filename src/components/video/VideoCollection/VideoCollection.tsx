import VideoTimestampList from "./../VideoTimestampList/VideoTimestampList.jsx"
import { Video } from "../../../lib/video/video.ts";
import { Reorder } from "framer-motion";
import "./VideoCollection.css"

export interface IVideoCollectionProperties {
	videos: Array<Video>;
	onReorder: (reordered: Array<Video>) => void
}

export function VideoCollection({ videos, onReorder }: IVideoCollectionProperties): React.ReactNode {
	return (
		<Reorder.Group layoutScroll className="timestamp-scrollbox-list" values={videos} onReorder={onReorder}>
			{videos.map(x => <VideoTimestampList key={x.videoID} video={x}></VideoTimestampList>)}
		</Reorder.Group>
	)
}

export default VideoCollection;
