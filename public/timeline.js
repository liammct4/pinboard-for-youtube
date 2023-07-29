// ----------------------------------
// 'timeline.js' content script for interacting with the active video timeline.
// ----------------------------------

var init = false;
var timelineContainer = null;
var mainVideo = null;
var tabID = null;
var currentVideoID = null;

function handleVideoTimelineResize() {
	timelineContainer.querySelectorAll("pfy-timeline-button").forEach(timestamp => {
		timestamp.updateOnTimelineBoundsResize();
	});;
}

// Observes size changes of the timeline progress bar of the current video, responsible for ensuring that 
// each timestamps rounded corners are flush with the arrow when overflowing.
var videoTimelineSizeObserver = new ResizeObserver(handleVideoTimelineResize);

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
		this.boxInner = null;
		this.timelineText = null;
		this.timestampArrow = null;
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

		this.boxInner = this.querySelector(".timestamp-box-inner");
		this.timestampArrow = this.querySelector(".timestamp-pointer-arrow");
		
		// Calculate position along timeline.
		let multiplier = this.timestamp.time / getActiveInfo().length;
		let percentage = `${multiplier * 100}%`;

		// Use a min max range restriction to prevent the timestamp from overflowing out of the video area.
		let collapsedLeft = `max(0px, min(calc(${percentage} - 20px), calc(100% - 40px)))`;
		let expandedLeft = `max(0px, min(calc(${percentage} - 100px), calc(100% - 200px)))`;
		
		// The arrow positioned directly above the point of the timestamp.
		this.timestampArrow.style.left = `max(0px, min(calc(${percentage} - 3px), calc(100% - 6px)))`;
		this.boxInner.style.left = collapsedLeft;

		this.timelineText = this.querySelector(".timestamp-inner-text");

		this.boxInner.addEventListener("mouseover",  () => {
			this.timelineText.innerHTML = this.timestamp.message;
			this.boxInner.style.left = expandedLeft;
		});

		this.boxInner.addEventListener("mouseleave", () => {
			this.timelineText.innerHTML = getTimestampFromSeconds(this.timestamp.time)
			this.boxInner.style.left = collapsedLeft;
		});

		this.boxInner.addEventListener("click", () => {
			mainVideo.currentTime = this.timestamp.time;
		});

		this.updateOnTimelineBoundsResize();
	}

	updateOnTimelineBoundsResize() {
		let arrowLeftPixelPosition = parseInt(getComputedStyle(this.timestampArrow).left);
		let arrowRightPixelPosition = parseInt(getComputedStyle(this.timestampArrow).right);

		// Sets the rounded corners to the available space left by the arrow or the maximum radius of 6px.
		// This makes the arrow flush with the timestamp.
		if (arrowLeftPixelPosition < 8) {
			// Means the arrow is overflowing above the bottom left rounded corner.
			this.boxInner.style["border-bottom-left-radius"] = `${Math.min(arrowLeftPixelPosition * 2, 6)}px`;
		}
		else if (arrowRightPixelPosition < 8) {
			// Means the arrow is overflowing above the bottom right rounded corner.
			this.boxInner.style["border-bottom-right-radius"] = `${Math.min(arrowRightPixelPosition * 2, 6)}px`;
		}
		else {
			this.boxInner.style["border-radius"] = "6px";
		}
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
	
	videoTimelineSizeObserver.observe(timelineContainer);
}

chrome.runtime.onMessage.addListener(async (request, _sender, response) => {		
	switch (request.type) {
		case "pfy_get_active_info":
			response(getActiveInfo());
			break;
		case "pfy_set_timestamp_buttons":
			response(setTimelineTimestamps(request.data));
			break;
	}
});

initialize();
