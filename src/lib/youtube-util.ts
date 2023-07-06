import * as TimeUtil from "./util/time-util.ts"
import * as request from "./../lib/request.ts"

export class DoesNotExistError extends Error {
	public requested: string;
	public originalError: string;
	
	constructor(message: string, requested: any, originalError: string) {
		super(message);
		this.name = "ValidationError";
		this.requested = requested;
		this.originalError = originalError;
	}
}

export const YOUTUBE_EXTRACT_VIDEO_ID_REGEX: RegExp = /.*\?v=(?<VideoID>[\w\d\-\_]*)/

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

export function getYoutubeVideoInfoFromLink(url: string): any {
	let result = JSON.parse(request.requestGet(`https://noembed.com/embed?url=${url}`))
	
	if (result.hasOwnProperty("error") && result.error == "400 Bad Request") {
		throw new DoesNotExistError("The video requested does not exist.", url, result.error);
	}

	return result;
}

export function getYoutubeVideoInfoFromVideoID(videoID: string): any {
	let link: string = getYouTubeLinkFromVideoID(videoID);
	
	return getYoutubeVideoInfoFromLink(link);
}

export function videoExists(url: string) {
	try {
		getYoutubeVideoInfoFromLink(url);
		return true;
	}
	catch (DoesNotExistError) {
		return false;
	}
}
