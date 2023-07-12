chrome.runtime.onMessage.addListener(async (request, _sender, response) => {	
	switch (request.type) {
		case "get_active_info":
			let mainVideo = document.querySelector("video");

			response({
				paused: mainVideo.paused,
				currentTime: mainVideo.currentTime,
				length: mainVideo.duration
			});
			break;
	}
	response(null);
});
