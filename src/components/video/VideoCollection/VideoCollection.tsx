import { useContext } from "react";
import { VideoContext, VideoListContext } from "../../../context/video.ts";
import { IVideo } from "../../../lib/video/video.ts";
import { Reorder } from "framer-motion";
import { VideoTimestampList } from "./../VideoTimestampList/VideoTimestampList.jsx"
import "./VideoCollection.css"

export interface IVideoCollectionProperties {
	onReorder: (reordered: IVideo[]) => void;
}

export function VideoCollection({ onReorder }: IVideoCollectionProperties): React.ReactNode {
	const collection = useContext(VideoListContext);
	
	return (
		<Reorder.Group layoutScroll className="timestamp-scrollbox-list" values={collection.videos} onReorder={onReorder}>
			{collection.videos.map(x =>
				<VideoContext.Provider key={x.id} value={x}>
					<VideoTimestampList></VideoTimestampList>
				</VideoContext.Provider>
			)}
		</Reorder.Group>
	)
}
