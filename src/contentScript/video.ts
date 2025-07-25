import { IVideoInfo, VideoScriptAction } from "../lib/browser/youtube";
import { YOUTUBE_EXTRACT_VIDEO_ID_REGEX } from "../lib/util/youtube/youtubeUtil";

function setVideoPosition(time: number): {} {
	let mainVideo = document.querySelector("video");

	if (mainVideo == null) {
		return {};
	}

	mainVideo.currentTime = time;
	return {};
}

function getVideoInfo(): IVideoInfo | null {
	let result = YOUTUBE_EXTRACT_VIDEO_ID_REGEX.exec(window.location.href);

	if (result == null || result.groups == undefined) {
		return null;
	}

	let video = document.querySelector("video") as HTMLVideoElement;

	return {
		id: result.groups["VideoID"],
		currentTime: video.currentTime,
		length: video.duration,
		paused: video.paused
	}
}

export function videoSetup() {
	chrome.runtime.onMessage.addListener(async (request, _sender, response) => {
		let type: VideoScriptAction = request.type;

		switch (type) {
			case "pfy_set_video_position":
				response(setVideoPosition(request.data));
				break;
			case "pfy_get_active_info":
				response(getVideoInfo());
				break;
		}
	});
}
