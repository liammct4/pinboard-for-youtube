import { useState, useRef } from "react"
import logo from "./../assets/logo/logo.png"
import SplitHeading from "./components/SplitHeading/SplitHeading.tsx"
import VideoCard from "./components/video/VideoCard/VideoCard.tsx"
import VideoTimestamp from "./components/video/VideoTimestamp/VideoTimestamp.tsx"
import VideoTimestampList from "./components/video/VideoTimestampList/VideoTimestampList.tsx"
import VideoCollection from "./components/video/VideoCollection/VideoCollection.tsx"
import * as TestData from "./data/testDataSet.ts"
import * as userData from "./lib/user/user-data.ts"
import { store, RootState } from "./app/store.ts"
import { Video } from "./lib/user/user-data.ts"
import { useSelector, useDispatch } from "react-redux"
import { addVideo, updateVideo, clearVideos } from "./features/videos/videoSlice.ts"
import "./App.css"

function App(): JSX.Element {
	const videos: Array<Video> = useSelector((state: RootState) => state.video.currentVideos);
	const dispatch = useDispatch();

	const addVideoClick = () => {
		// TODO: Add modal to enter video data.
		let item: Video = TestData.sampleVideoData[Math.floor(Math.random() * TestData.sampleVideoData.length)];

		dispatch(addVideo(item))
	}

	return (
		<div className="outer-body">
			<div className="outer-section-area top-area">
				<div id="top-section-inner-wrap">
					<img className="logo-standard" src="../assets/logo/logo.png"/>
					<h1 className="title-heading">Pinboard for YouTube</h1>
				</div>
				<hr></hr>
			</div>
			<div className="inner-body">
				{/* Current video */}
				<SplitHeading text="Current video"></SplitHeading>
				<div id="current-video-card">
					<VideoCard videoID="xcJtL7QggTI"></VideoCard>
				</div>
				<div className="button-bar">
					<button className="button-small">Save video</button>
					<button className="button-small">Pin timestamp</button>
				</div>
				{/* My timestamps */}
				<SplitHeading text="My video timestamps"></SplitHeading>
				<div className="button-bar regular-vmargin">
					<button className="button-small" onClick={addVideoClick}>Add video</button>
					<button className="button-small" onClick={() => dispatch(clearVideos())}>Clear videos</button>
				</div>
				<div id="timestamp-scrollbox">
					<VideoCollection videos={videos}></VideoCollection>
				</div>
			</div>
			<div className="outer-section-area bottom-area">
				<hr></hr>
				<div id="bottom-section-inner-wrap">
					<button style={{gridColumn: 1, gridRow: 1}} className="button-small">Options</button>
					<button style={{gridColumn: 1, gridRow: 2}} className="button-small">Help</button>
					<h2 className="outer-area-subtle-text">Version 1.0.0</h2>
				</div>
			</div>
		</div>
	);
}

export default App;
