import * as TimeUtil from "./../generic/timeUtil.ts"
import * as request from "./../request.ts"

export class DoesNotExistError extends Error {
	public requested: string;
	public originalError: string;
	
	constructor(message: string, requested: string, originalError: string) {
		super(message);
		this.name = "ValidationError";
		this.requested = requested;
		this.originalError = originalError;
	}
}

export interface IYoutubeVideoInfo {
	// video_id is not apart of the API response. It is set manually.
	video_id: string;
	thumbnail_width: number;
	width: number;
	provider_name: string;
	author_name: string;
	thumbnail_url: string;
	author_url: string;
	title: string;
	provider_url: string;
	height: number;
	type: string;
	html: string;
	url: string;
	thumbnail_height: number;
	version: string;
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

export async function getYoutubeVideoInfoFromLink(url: string): Promise<IYoutubeVideoInfo | undefined> {
	let response = await request.GlobalRequestHandler.sendRequest("GET", `https://www.youtube.com/oembed?url=${url}`);
	
	if (response?.status == 404) {
		return undefined;
		//throw new DoesNotExistError("The video requested does not exist.", url, response.body);
	}
	
	let info = JSON.parse(response?.body) as IYoutubeVideoInfo;
	info.url = url;
	info.video_id = getVideoIdFromYouTubeLink(url);

	return info;
}

export async function getYoutubeVideoInfoFromVideoID(videoID: string): Promise<IYoutubeVideoInfo | undefined> {
	let link: string = getYouTubeLinkFromVideoID(videoID);
	
	return getYoutubeVideoInfoFromLink(link);
}

/**
 * Determines whether a YouTube video exists by checking the YouTube API.
 * @param url The url to check.
 * @returns True if the video in a YouTube url exists, otherwise False.
 */
export function doesVideoExist(url: string): boolean {
	try {
		getYoutubeVideoInfoFromLink(url);
		return true;
	}
	catch (DoesNotExistError) {
		return false;
	}
}

/**
 * Determines whether a url contains a valid YouTube video ID. This does not check if the video exists, only if it is formatted correctly.
 * @param url The url to check.
 * @returns True if the url contains a valid formatted YouTube video ID, otherwise false. 
 */
export function urlContainsVideoID(url: string): boolean {
	return YOUTUBE_EXTRACT_VIDEO_ID_REGEX.test(url);
}
