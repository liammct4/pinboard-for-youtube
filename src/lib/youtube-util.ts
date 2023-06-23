import * as TimeUtil from "./util/time-util.ts"

const YOUTUBE_EXTRACT_VIDEO_ID_REGEX: RegExp = /.*\?v=(?<VideoID>[\w\d\-\_]*)/

export function getVideoIdFromYouTubeLink(url: string): string {
	const match = YOUTUBE_EXTRACT_VIDEO_ID_REGEX.exec(url);
	
	if (match == null) {
		throw new TypeError("Invalid argument provided, the link provided does not contain a video ID.")
	}

	let videoID: string = match!.groups!["VideoID"]!;

	if (videoID?.length != 11) {
		throw new TypeError("Invalid argument provided, the extracted video ID was not 11 characters long.")
	}

	return videoID;
}

export function getYouTubeLinkFromVideoID(videoID: string): string {
	if (!videoID) {
		throw new TypeError("Invalid argument provided, the video ID was empty.");
	}

	if (videoID.length != 11) {
		throw new TypeError("Invalid argument provided, the video ID was not the correct length, all ID's must be 11 characters long.")
	}

	return `https://www.youtube.com/watch?v=${videoID}`;
}

export function getTimestampVideoLinkFromSeconds(videoID: string, seconds: number): string {
	if (!videoID) {
		throw new TypeError("Invalid argument provided, the video ID was empty.");
	}

	if (seconds < 0) {
		throw new TypeError("Invalid argument provided, seconds cannot be negative.")
	}

	return `${getYouTubeLinkFromVideoID(videoID)}&t=${seconds}`;
}

export function getTimestampVideoLinkFromTimestamp(videoID: string, timestamp: string) : string {
	let seconds: number = TimeUtil.getSecondsFromTimestamp(timestamp);

	return getTimestampVideoLinkFromSeconds(videoID, seconds);
}
