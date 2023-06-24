import VideoTimestampList from "./../VideoTimestampList/VideoTimestampList.jsx"
import { Video } from "./../../../lib/user/user-data.ts"
import "./VideoCollection.css"

export interface IVideoCollectionProperties {
	videos: Array<Video>
}

export function VideoCollection({ videos }: IVideoCollectionProperties): React.ReactNode {
	let items: Array<JSX.Element> = videos.map((x) => <li key={x["videoID"]}><VideoTimestampList timestamps={x["timestamps"]} videoID={x["videoID"]}></VideoTimestampList></li>);

	return (
		<ul className="timestamp-scrollbox-list">
			{items}
		</ul>
	)
}

export default VideoCollection;
