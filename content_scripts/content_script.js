function getActiveInfo() {
	let mainVideo = document.querySelector("video");

	return {
		paused: mainVideo.paused,
		currentTime: mainVideo.currentTime,
		length: mainVideo.duration
	};
}

function setVideoPosition(time) {
	let mainVideo = document.querySelector("video");

	mainVideo.currentTime = time;

	return {};
}

chrome.runtime.onMessage.addListener(async (request, _sender, response) => {	
	switch (request.type) {
		case "get_active_info":
			response(getActiveInfo());
			break;
		case "set_video_position":
			response(setVideoPosition(request.data));
			break;
	}
	response(null);
});
