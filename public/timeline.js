// ----------------------------------
// 'timeline.js' content script for interacting with the active video timeline.
// ----------------------------------

function getVideoIDFromLink(videoURL) {
	let extractIDRegex = /watch\?v=(?<videoID>.{11})/;

	let result = extractIDRegex.exec(videoURL);

	return result.groups.videoID;
}

function getMainVideo() {
	return document.querySelector("video");
}

// Due to tabs being discarded (Edge) after a tab is idle, accessing the timeline DOM should
// be done through this function.
function getTimelineContainers() {
	var timelineOuterContainer = document.querySelector(".pfy-timeline-container");
	var timelineContainer = timelineOuterContainer.querySelector(".pfy-timeline-inner");

	return { timelineContainer, timelineOuterContainer };
}

function handleVideoTimelineResize() {
	var { timelineContainer } = getTimelineContainers();

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
		
		this.expandedLeft = "";
		this.collapsedLeft = "";

		// Dragging the timestamp along the timeline.
		this.inUserDrag = false;
		this.isMouseDown = false;
		this.handlers = [];
	}

	connectedCallback() {
		var { timelineContainer } = getTimelineContainers();

		this.innerHTML = `
			<div class="timestamp-box-outer">
				<button class="timestamp-box-inner">
					<p class="timestamp-inner-text"></p>
				</button>

				<svg
					class="timestamp-pointer-arrow"
					width="8"
					height="6"
					viewBox="0 0 2.1166667 1.5874999"
					version="1.1"
					id="svg5"
					inkscape:version="1.1.1 (3bf5ae0d25, 2021-09-20)"
					sodipodi:docname="arrow_down_timeline.svg"
					xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
					xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:svg="http://www.w3.org/2000/svg">
						<sodipodi:namedview
						id="namedview7"
						pagecolor="#505050"
						bordercolor="#eeeeee"
						borderopacity="1"
						showgrid="false"
						units="px"/>
						<defs
						id="defs2" />
						<g
							id="layer1">
							<path
								class="arrow-fill"
								id="rect2294"
								style="fill-opacity:1;stroke:none;stroke-width:0.264583;stroke-dasharray:none;stroke-opacity:1"
								d="M 0,0.26467518 V 0 h 2.1166666 l 1e-7,0.26467518 -1.0583333,1.32291662 z"
								sodipodi:nodetypes="cccccc" />
							<path
								class="arrow-border"
								style="fill:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
								d="M 0,0.26467518 1.0583334,1.5875918 2.1166667,0.26467518"
								id="path1006"
								sodipodi:nodetypes="ccc" />
						</g>
				</svg>
			</div>
		`;

		this.boxInner = this.querySelector(".timestamp-box-inner");
		this.timestampArrow = this.querySelector(".timestamp-pointer-arrow");
		this.timelineText = this.querySelector(".timestamp-inner-text");

		this.boxInner.setAttribute("dragging", "idle");
		this.timestampArrow.setAttribute("dragging", "idle");

		this.rerender();

		// The timestamp expands when hovered with the message.
		this.boxInner.addEventListener("mouseover",  () => {
			if (this.inUserDrag) {
				return;
			}

			this.timelineText.innerHTML = this.timestamp.message;
			this.boxInner.style.left = this.expandedLeft;
		});

		// The timestamp collapses when not hovered.
		this.boxInner.addEventListener("mouseleave", () => {
			this.timelineText.innerHTML = getTimestampFromSeconds(this.timestamp.time)
			this.boxInner.style.left = this.collapsedLeft;
		});

		// Responsible for checking if the user has started dragging the timestamp.
		this.boxInner.addEventListener("mousedown", (e) => {
			// This will be turned false in time for the setTimeout below if the user releases the mouse.
			this.mouseIsDown = true;

			setTimeout(() => {
				// Mouse is still down.
				if (this.mouseIsDown) {
					this.inUserDrag = true;
					this.boxInner.setAttribute("dragging", "drag");
					this.timestampArrow.setAttribute("dragging", "drag");
				}

				// Don't go below 200ms. See: https://stackoverflow.com/questions/38846373/how-much-time-should-the-mouse-left-button-be-held
				// Trackpads also experience issues with low values.
			}, 230); 
		});

		// Responsible for updating the timestamp to the current mouse position.
		document.addEventListener("mousemove", (e) => {
			if (this.inUserDrag) {
				let leftMousePositionOverTimeline = e.clientX - timelineContainer.getBoundingClientRect().left;
				let timelineWidth = parseInt(getComputedStyle(timelineContainer).width);
				let videoDuration = getActiveInfo().length;
				
				// Don't let the time become negative or greater than the length of the video.
				let multiplier = Math.min(Math.max(leftMousePositionOverTimeline / timelineWidth, 0), 1);
				
				this.timestamp.time = Math.round(multiplier * videoDuration);
				
				this.rerender();
			}
		});

		// Responsible for ending the user drag and dispatching the timestamp change event.
		document.addEventListener("mouseup", () => {
			this.mouseIsDown = false;
			this.boxInner.setAttribute("dragging", "idle");
			this.timestampArrow.setAttribute("dragging", "idle");

			// To ensure the mouseup event listener for boxInner fires first. Set a delay.
			setTimeout(() => {
				if (this.inUserDrag) {
					this.dispatchTimestampChange();
					this.inUserDrag = false;
				}
			}, 100);
		})

		// This differs from the above event by setting the timestamp state to be as if the user hovered over it normally.
		this.boxInner.addEventListener("mouseup", () => {
			this.boxInner.setAttribute("dragging", "idle");
			this.timestampArrow.setAttribute("dragging", "idle");

			if (this.inUserDrag) {
				this.boxInner.style.left = this.expandedLeft;
				this.timelineText.innerHTML = this.timestamp.message;
	
				this.dispatchTimestampChange();
				this.inUserDrag = false;

				return;
			}

			getMainVideo().currentTime = this.timestamp.time;
		});
	}

	/**
	 * Rerenders the timestamp along the timeline. Use whenever the timestamp changes.
	 */
	rerender() {
		// Calculate position along timeline.
		let multiplier = this.timestamp.time / getActiveInfo().length;
		let percentage = `${multiplier * 100}%`;

		// Use a min max range restriction to prevent the timestamp from overflowing out of the video area.
		this.collapsedLeft = `max(0px, min(calc(${percentage} - 20px), calc(100% - 40px)))`;
		this.expandedLeft = `max(0px, min(calc(${percentage} - 100px), calc(100% - 200px)))`;
		this.timelineText.innerHTML = getTimestampFromSeconds(this.timestamp.time);

		// The arrow positioned directly above the point of the timestamp.
		this.timestampArrow.style.left = `max(0px, min(calc(${percentage} - 3px), calc(100% - 6px)))`;
		this.boxInner.style.left = this.collapsedLeft;

		this.updateOnTimelineBoundsResize();
	}

	/**
	 * Checks and updates the corner radius of the timestamp with regard to the arrow.
	 */
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

	/**
	 * Dispatches the timestamp change event and runs subscribed handlers.
	 */
	dispatchTimestampChange() {
		this.handlers.forEach(handler => {
			handler(this.timestamp);
		});
	}
	
	/**
	 * Adds a listener to the timestamp change event.
	 * @param {(newTimestamp: Timestamp) => void} handler 
	 */
	subscribeTimestampChange(handler) {
		this.handlers.push(handler); 
	}

	/**
	 * Removes a listener from the timestamp change event.
	 * @param {(newTimestamp: Timestamp) => void} handler 
	 */
	unsubscribeTimestampChange(handler) {
		let index = this.handlers.findIndex(h => h == handler);

		this.handlers.splice(index, 1);
	}
}

customElements.define("pfy-timeline-button", TimestampTimelineButton);

async function handleTimestampChange(newTimestamp) {
	// Subscribed to the timestamp change event of every timestamp button.
	let userData = (await chrome.storage.local.get("user_data"))?.user_data;
	let videos = userData?.videos;

	if (videos == undefined) {
		return;
	}

	let video = videos.find(v => v.videoID == getVideoIDFromLink(window.location.href));
	let timestampIndex = video.timestamps.findIndex(t => t.id == newTimestamp.id);

	video.timestamps[timestampIndex] = newTimestamp;

	// Save changes to storage.
	await chrome.storage.local.set({ user_data: userData });
}

function setTimelineTimestamps(timestamps) {
	var { timelineContainer } = getTimelineContainers();
	timelineContainer.innerHTML = "";
	
	for (let timestamp of timestamps) {
		let timestampButton = new TimestampTimelineButton(timestamp);
		timestampButton.subscribeTimestampChange(handleTimestampChange);

		timelineContainer.appendChild(timestampButton);
	}

	return {};
}

function getActiveInfo() {
	let mainVideo = getMainVideo();

	return {
		paused: mainVideo.paused,
		currentTime: mainVideo.currentTime,
		length: mainVideo.duration
	};
}

function changeTheme(theme) {
	var { timelineContainer } = getTimelineContainers();
	
	Object.keys(theme.palette).forEach(key => {
		timelineContainer.style.setProperty(`--pfy-${key}`, theme.palette[key]);
	});
}

async function update() {
	let storage = await chrome.storage.local.get();

	// Fetch videos from storage.
	if (storage.user_data != undefined) {
		let video = storage.user_data.videos.find(x => x.videoID == getVideoIDFromLink(window.location.href));

		// If it is null, that means that storage hasn't been initialized, or the settings.
		if (storage?.user_data?.config?.userSettings.find(x => x.settingName == "timestampButtonsEnabled").value ?? true) {
			setTimelineTimestamps(video?.timestamps ?? []);
		}
		else {
			setTimelineTimestamps([]);
		}
	}

	videoTimelineSizeObserver.observe(getTimelineContainers().timelineContainer);

	// Fetch current theme from storage.
	let currentTheme = storage.user_data?.config?.theme;

	if (currentTheme != undefined) {
		changeTheme(currentTheme);
	}
}

function probeAndUpdateTimestamps() {	
	// Check if it hasnt been already initialized.
	let existingContainer = document.querySelector(".pfy-timeline-container");
	if (existingContainer != undefined) {
		update();
		return;
	}
	
	let progressBar = document.querySelector(".ytp-chrome-bottom");
	
	if (progressBar == undefined) {
		return;
	}

	timelineOuterContainer = document.createElement("div");
	timelineOuterContainer.classList.add("pfy-timeline-container");
	timelineOuterContainer.classList.add("pfy-style-context");

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
				padding: 0;
				background: var(--pfy-empty-01-raised);
				border: 1px solid var(--pfy-primary-dark);
				border-radius: var(--pfy-spacing-standard);
				flex-grow: 1;
				cursor: pointer;
				position: absolute;
				transform: translateY(-87px);
			}

			.timestamp-box-inner[dragging="idle"] {
				transition: width 220ms, left 220ms, transform 220ms;
			}
			
			.timestamp-box-inner[dragging="drag"] {
				transform: translate(0px, -91px);
			}
			
			.timestamp-box-inner:hover[dragging="idle"] {
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
			}
			
			.timestamp-pointer-arrow[dragging="idle"] {
				transition: transform 220ms;
			}

			.timestamp-pointer-arrow[dragging="drag"] {
				transform: translate(0px, -95.5px);
			}

			.arrow-fill {
				fill: var(--pfy-empty-01-raised)
			}

			.arrow-border {
				stroke: var(--pfy-primary-dark);
			}

			.timestamp-inner-text {
				text-align: center;
				text-wrap: nowrap;
				font-size: var(--pfy-font-text-standard);
				color: var(--pfy-text-normal);
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

	progressBar.appendChild(timelineOuterContainer);

	let video = document.querySelector("video");
	video.addEventListener("loadeddata", update);

	update();
}

async function initialize() {
	chrome.storage.local.onChanged.addListener(async () => {
		update();
	});

	window.navigation.addEventListener("navigate", () => {
		setTimeout(() => {
			probeAndUpdateTimestamps();
		}, 200);
	});

	setTimeout(() => probeAndUpdateTimestamps(), 200);
}

chrome.runtime.onMessage.addListener(async (request, _sender, response) => {		
	switch (request.type) {
		case "pfy_get_active_info":
			response(getActiveInfo());
			break;
	}
});

initialize();
