import { useState } from 'react'
import logo from './../assets/logo/logo.png'
import SplitHeading from "./components/SplitHeading/SplitHeading.jsx"
import VideoCard from "./components/video/VideoCard/VideoCard.jsx"
import VideoTimestamp from "./components/video/VideoTimestamp/VideoTimestamp.jsx"
import VideoTimestampList from "./components/video/VideoTimestampList/VideoTimestampList.jsx"
import VideoCollection from "./components/video/VideoCollection/VideoCollection.jsx"
import * as TestData from "./data/testDataSet.js"
import './App.css'

function App() {
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
					<VideoCard video-id="xcJtL7QggTI"></VideoCard>
				</div>
				<div className="current-video-options">
					<button className="button-small">Save video</button>
					<button className="button-small">Pin timestamp</button>
				</div>
				{/* My timestamps */}
				<SplitHeading text="My video timestamps"></SplitHeading>
				<div id="timestamp-scrollbox">
					<VideoCollection videos={TestData.sampleVideoData}></VideoCollection>
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
	)
};

export default App;
