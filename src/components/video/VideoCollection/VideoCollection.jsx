import VideoTimestampList from "./../VideoTimestampList/VideoTimestampList.jsx"
import "./VideoCollection.css"

export function VideoCollection({ videos }) {

	/* Structure of "videos", which is a JSON array of objects:
		"video": [
			{
				"video-id": "LXb3EKWsInQ",
				"timestamps": [
					{ "time": 103, "message": "Test message" },
					{ "time": 493, "message": "Another message" },
					{ "time": 1304, "message": "Third message" },
				]
			},
			{
				"video-id": "ZjVAsJOl8SM",
				"timestamps": [
					{ "time": 1063, "message": "Another timestamp." }
				]
			}
		]
	*/

	let items = videos.map((x) => <li key={x["video-id"]}><VideoTimestampList timestamps={x["timestamps"]} video-id={x["video-id"]}></VideoTimestampList></li>);

	return (
		<ul className="timestamp-scrollbox-list">
			{items}
		</ul>
	)
}

export default VideoCollection;
