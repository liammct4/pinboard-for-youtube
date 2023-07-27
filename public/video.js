// ----------------------------------
// 'video.js' content script for interacting with the active video on the current tab.
// ----------------------------------

var init = false;
var mainVideo = null;

function getActiveInfo() {
	return {
		paused: mainVideo.paused,
		currentTime: mainVideo.currentTime,
		length: mainVideo.duration
	};
}

function setVideoPosition(time) {
	mainVideo.currentTime = time;

	return {};
}

function initialize() {
	// Initialization code for getting things like elements etc.
	mainVideo = document.querySelector("video");

	init = true;
}

chrome.runtime.onMessage.addListener(async (request, _sender, response) => {		
	switch (request.type) {
		case "pfy_video.js_check_init":
			response(init);
			break;
		case "pfy_video.js_init":
			initialize();
			response({ });
			break;
		case "pfy_get_active_info":
			response(getActiveInfo());
			break;
		case "pfy_set_video_position":
			response(setVideoPosition(request.data));
			break;
	}
});
