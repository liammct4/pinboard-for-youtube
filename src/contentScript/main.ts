import { timelineSetup } from "./timeline/timeline";

let isTimelineSetup = false;
let lastLink = "";

function injectionSetup() {
	if (window.location.href == lastLink) {
		setTimeout(injectionSetup, 200);
		return;
	}

	lastLink = window.location.href;

	if (!isTimelineSetup) {
		isTimelineSetup = timelineSetup();
	}

	if (!isTimelineSetup) {
		setTimeout(injectionSetup, 200);
	}
}

injectionSetup();
