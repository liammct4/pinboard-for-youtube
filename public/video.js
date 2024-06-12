// ----------------------------------
// 'video.js' content script for interacting with the active video on the current tab.
// ----------------------------------

function getMainVideo() {
	return document.querySelector("video");
}

function setVideoPosition(time) {
	let mainVideo = getMainVideo();
	mainVideo.currentTime = time;

	return {};
}

chrome.runtime.onMessage.addListener(async (request, _sender, response) => {		
	switch (request.type) {
		case "pfy_set_video_position":
			response(setVideoPosition(request.data));
			break;
	}
});
