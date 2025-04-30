import { setupStorageAndStoreSync, syncStoreToStorage } from "../app/setup";
import { controlsSetup } from "./controls/controls";
import { timelineSetup } from "./timeline/timeline";
import { videoSetup } from "./video";

let isTimelineSetup = false;
let isControlsSetup = false;
let lastLink = "";

function contentScriptMain() {
	
	setupStorageAndStoreSync();
	syncStoreToStorage();
	
	injectionSetup();
	videoSetup();
}

function injectionSetup() {
	if (window.location.href == lastLink) {
		setTimeout(injectionSetup, 200);
		return;
	}

	lastLink = window.location.href;

	if (!isTimelineSetup) {
		isTimelineSetup = timelineSetup();
	}

	if (!isControlsSetup) {
		isControlsSetup = controlsSetup();
	}

	if (!isTimelineSetup || !isControlsSetup) {
		setTimeout(injectionSetup, 200);
	}
}

contentScriptMain();
