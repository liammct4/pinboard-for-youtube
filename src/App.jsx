import { useState } from 'react'
import logo from './../assets/logo/logo.png'
import SplitHeading from "./components/SplitHeading/SplitHeading.jsx"
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
				<video-card id="current-video-card" videoid="xcJtL7QggTI"></video-card>
				<div className="current-video-options">
					<button className="button-small">Save video</button>
					<button className="button-small">Pin timestamp</button>
				</div>
				{/* My timestamps */}
				<SplitHeading text="My video timestamps"></SplitHeading>
				<div id="timestamp-scrollbox">
					<ul id="timestamp-scrollbox-list">
						<video-timestamp-list url="https://www.youtube.com/watch?v=LXb3EKWsInQ"></video-timestamp-list>
						<video-timestamp-list url="https://www.youtube.com/watch?v=njX2bu-_Vw4"></video-timestamp-list>
						<video-timestamp-list url="https://www.youtube.com/watch?v=AKeUssuu3Is"></video-timestamp-list>
						<video-timestamp-list url="https://www.youtube.com/watch?v=ZjVAsJOl8SM"></video-timestamp-list>
						<video-timestamp-list url="https://www.youtube.com/watch?v=PnvkrBXmLSI"></video-timestamp-list>
						<video-timestamp-list url="https://www.youtube.com/watch?v=ERYG3NE1DO8"></video-timestamp-list>
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
