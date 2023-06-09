import * as TimeUtil from "./util/time-util.js"

const YOUTUBE_EXTRACT_VIDEO_ID_REGEX = /.*\?v=(?<VideoID>[\w\d\-\_]*)/

export function getVideoIdFromYouTubeLink(url) {
	try {
		const { groups: { VideoID } } = YOUTUBE_EXTRACT_VIDEO_ID_REGEX.exec(url);
		return VideoID;
	}
	catch {
		return null;
	}
}

export function getYouTubeLinkFromVideoID(videoID) {
	return `https://www.youtube.com/watch?v=${videoID}`;
}

export function getTimestampVideoLinkFromSeconds(videoID, seconds) {
	return `https://www.youtube.com/watch?v=${videoID}&t=${seconds}`;
}

export function getTimestampVideoLinkFromTimestamp(timestamp) {
	let seconds = TimeUtil.getSecondsFromTimestamp(timestamp);

	return getTimestampVideoLinkFromSeconds(seconds);
}
