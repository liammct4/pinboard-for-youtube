import * as TimeUtil from "./util/time-util.js"
import { isNumeric } from "./util/misc/type-util.js"

const YOUTUBE_EXTRACT_VIDEO_ID_REGEX = /.*\?v=(?<VideoID>[\w\d\-\_]*)/

export function getVideoIdFromYouTubeLink(url) {
	const match = YOUTUBE_EXTRACT_VIDEO_ID_REGEX.exec(url);
	
	if (match == null) {
		throw new TypeError("Invalid argument provided, the link provided does not contain a video ID.")
	}

	let VideoID = match.groups["VideoID"]

	if (VideoID.length != 11) {
		throw new TypeError("Invalid argument provided, the extracted video ID was not 11 characters long.")
	}
	return VideoID;
}

export function getYouTubeLinkFromVideoID(videoID) {
	if (!videoID) {
		throw new TypeError("Invalid argument provided, the video ID was empty.");
	}

	if (videoID.length != 11) {
		throw new TypeError("Invalid argument provided, the video ID was not the correct length, all ID's must be 11 characters long.")
	}

	return `https://www.youtube.com/watch?v=${videoID}`;
}

export function getTimestampVideoLinkFromSeconds(videoID, seconds) {
	if (!videoID) {
		throw new TypeError("Invalid argument provided, the video ID was empty.");
	}

	if (!isNumeric(seconds)) {
		throw new TypeError("Invalid argument provided, the seconds was not a number.");
	}

	if (seconds < 0) {
		throw new TypeError("Invalid argument provided, seconds cannot be negative.")
	}

	return `${getYouTubeLinkFromVideoID(videoID)}&t=${seconds}`;
}

export function getTimestampVideoLinkFromTimestamp(videoID, timestamp) {
	let seconds = TimeUtil.getSecondsFromTimestamp(timestamp);

	return getTimestampVideoLinkFromSeconds(videoID, seconds);
}
