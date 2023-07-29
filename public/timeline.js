// ----------------------------------
// 'timeline.js' content script for interacting with the active video timeline.
// ----------------------------------

var init = false;
var timelineContainer = null;
var mainVideo = null;
var tabID = null;
var currentVideoID = null;

// This is copy and pasted from the utilities folder.
// TODO: Find method to reuse the function already defined. 
function getTimestampFromSeconds(seconds) {
	if (seconds < 0) {
		throw new TypeError("Invalid argument provided, seconds was negative.");
	}

	let remaining = seconds;

	let hours = Math.floor(remaining / (60 * 60));
	remaining = remaining % (60 * 60);

	let minutes = Math.floor(remaining / 60);
	remaining = remaining % 60;

	let result = "";

	if (hours > 0) {
		result += `${hours}:`;
	}

	result += `${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;

	return result;
}

class TimestampTimelineButton extends HTMLElement {
	constructor(timestamp) {
		super();
		this.timestamp = timestamp;
		this.timelineText = null;
	}

	connectedCallback() {
		this.innerHTML = `
			<div class="timestamp-box-outer">
				<button class="timestamp-box-inner">
					<p class="timestamp-inner-text">${getTimestampFromSeconds(this.timestamp.time)}</p>
				</button>
				<img class="timestamp-pointer-arrow" src="${chrome.runtime.getURL('arrow_down_timeline.svg')}">
			</div>
		`;

		let boxInner = this.querySelector(".timestamp-box-inner");
		let arrow = this.querySelector(".timestamp-pointer-arrow");
		
		// Calculate position along timeline.
		let multiplier = this.timestamp.time / getActiveInfo().length;
		let percentage = `${multiplier * 100}%`;

		// Use a min max range restriction to prevent the timestamp from overflowing out of the video area.
		let collapsedLeft = `max(0px, min(calc(${percentage} - 20px), calc(100% - 40px)))`;
		let expandedLeft = `max(0px, min(calc(${percentage} - 100px), calc(100% - 200px)))`;
		
		// The arrow positioned directly above the point of the timestamp.
		arrow.style.left = `max(0px, min(calc(${percentage} - 3px), calc(100% - 6px)))`;
		boxInner.style.left = collapsedLeft;

		this.timelineText = this.querySelector(".timestamp-inner-text");

		boxInner.addEventListener("mouseover",  () => {
			this.timelineText.innerHTML = this.timestamp.message;
			boxInner.style.left = expandedLeft;
		});

		boxInner.addEventListener("mouseleave", () => {
			this.timelineText.innerHTML = getTimestampFromSeconds(this.timestamp.time)
			boxInner.style.left = collapsedLeft;
		});

		boxInner.addEventListener("click", () => {
			mainVideo.currentTime = this.timestamp.time;
		});
	}
}

customElements.define("pfy-timeline-button", TimestampTimelineButton);

function setTimelineTimestamps(timestamps) {
	timelineContainer.innerHTML = "";
	
	for (let timestamp of timestamps) {
		let timestampButton = new TimestampTimelineButton(timestamp);

		timelineContainer.appendChild(timestampButton);
	}

	return {};
}

function getActiveInfo() {
	return {
		paused: mainVideo.paused,
		currentTime: mainVideo.currentTime,
		length: mainVideo.duration
	};
}

async function initialize() {
	init = true;
	let progressBar = document.querySelector(".ytp-chrome-bottom");
	mainVideo = document.querySelector("video");
	
	if (progressBar == undefined) {
		return;
	}

	let timelineOuterContainer = document.createElement("div");
	timelineOuterContainer.setAttribute("class", "pfy-timeline-container");

	timelineOuterContainer.innerHTML = `
		<style src="common-definitions.css"></style>
		<style src="globals.css"></style>
		<style>
			.timestamp-box-outer {
				width: 100%;
				height: 26px;
				display: flex;
				flex-direction: column;
				position: absolute;
				transition: transform 220ms;
			}
			
			.timestamp-box-inner {
				width: 40px;
				height: 22px;
				background: var(--subtle-background);
				border: 1px solid var(--dark-accent);
				border-radius: 6px;
				flex-grow: 1;
				cursor: pointer;
				position: absolute;
				transform: translateY(-87px);
				transition: width 220ms, left 220ms, transform 220ms;
			}
			
			.timestamp-box-inner:hover {
				width: 200px;
				transform: translate(0px, -91px);
			}

			.timestamp-box-inner:hover + .timestamp-pointer-arrow {
				transform: translate(0px, -95.5px);
			}

			.timestamp-pointer-arrow {
				width: 6px;
				height: 4px;
				margin-top: -1px;
				top: 100%;
				position: absolute;
				pointer-events: none;
				transform: translate(0px, -91.5px);
				transition: transform 220ms;
			}

			.timestamp-inner-text {
				text-align: center;
				text-wrap: nowrap;
				font-size: 9pt;
				color: var(--dark-accent);
				overflow: hidden;
				margin: auto 0;
				margin-top: 1px;
			}

			.pfy-timeline-inner {
				width: 100%;
			}
		</style>
		<div class="pfy-timeline-inner">

		</div>
	`;

	currentVideoID = document.querySelector("body > .watch-main-col > meta[itemprop='identifier']").getAttribute("content");
	progressBar.appendChild(timelineOuterContainer);
	timelineContainer = timelineOuterContainer.querySelector(".pfy-timeline-inner");
	
	let videos = (await chrome.storage.local.get("user_data"))?.user_data?.videos;

	if (videos != undefined) {
		let video = videos.find(x => x.videoID == currentVideoID);
		setTimelineTimestamps(video.timestamps);
	}
}

chrome.runtime.onMessage.addListener(async (request, _sender, response) => {		
	switch (request.type) {
		case "pfy_timeline.js_check_init":
			response(init);
			break;
		case "pfy_timeline.js_init":
			initialize();
			response({ });
			break;
		case "pfy_get_active_info":
			response(getActiveInfo());
			break;
		case "pfy_set_timestamp_buttons":
			response(setTimelineTimestamps(request.data));
			break;
	}
});

initialize();
