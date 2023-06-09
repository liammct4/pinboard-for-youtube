import { useState } from 'react'
import logo from './../assets/logo/logo.png'
import SplitHeading from "./components/SplitHeading/SplitHeading.jsx"
import VideoCard from "./components/video/VideoCard/VideoCard.jsx"
import VideoTimestamp from "./components/video/VideoTimestamp/VideoTimestamp.jsx"
import './App.css'

// TODO: Convert web components to react components

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
					<ul id="timestamp-scrollbox-list">
						{/* TODO: Convert video-timestamp-list to react component with full URL's. */}
						<li>
							<VideoCard video-id="LXb3EKWsInQ"></VideoCard>
							{/* Test timestamps which will be integrated into video-timestamp-list. */}
							<VideoTimestamp video-id="AKeUssuu3Is" time="63" message="Timestamp at the start of the video to test string padding."></VideoTimestamp>
							<VideoTimestamp video-id="AKeUssuu3Is" time="4351" message="Timestamp in the middle..."></VideoTimestamp>
						</li>
						<li><VideoCard video-id="njX2bu-_Vw4"></VideoCard></li>
						<li><VideoCard video-id="AKeUssuu3Is"></VideoCard></li>
						<li><VideoCard video-id="ZjVAsJOl8SM"></VideoCard></li>
						<li><VideoCard video-id="PnvkrBXmLSI"></VideoCard></li>
						<li><VideoCard video-id="ERYG3NE1DO8"></VideoCard></li>
					</ul>
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
