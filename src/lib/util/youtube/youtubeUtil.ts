import { getSecondsFromTimestamp } from "../generic/timeUtil";
import { GlobalRequestHandler } from "../request";

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

export const YOUTUBE_EXTRACT_VIDEO_ID_REGEX: RegExp = /(?<VideoID>[A-z0-9\-_]{11})/

type GetVideoIDReason = "NO_VIDEO_ID" | "NOT_11_CHARACTERS";
export function getVideoIdFromYouTubeLink(url: string): Result<string, GetVideoIDReason> {
	const match = YOUTUBE_EXTRACT_VIDEO_ID_REGEX.exec(url);
	
	if (match == null) {
		return { success: false, reason: "NO_VIDEO_ID" };
	}

	let videoID: string = match!.groups!["VideoID"]!;

	if (videoID?.length != 11) {
		return { success: false, reason: "NOT_11_CHARACTERS" };
	}

	return { success: true, result: videoID };
}

export function getYouTubeLinkFromVideoID(videoID: string): Result<string, "NOT_11_CHARACTERS"> {
	if (videoID.length != 11) {
		return { success: false, reason: "NOT_11_CHARACTERS" };
	}

	return {
		success: true,
		result: `https://www.youtube.com/watch?v=${videoID}`
	};
}

export function getTimestampVideoLinkFromSeconds(videoID: string, seconds: number): Result<string, "SECONDS_ARE_NEGATIVE" | "INVALID_ID"> {
	if (seconds < 0) {
		return { success: false, reason: "SECONDS_ARE_NEGATIVE" }
	}

	let result = getYouTubeLinkFromVideoID(videoID);

	if (!result.success) {
		return { success: false, reason: "INVALID_ID" };
	}

	return {
		success: true,
		result: `${result.result}&t=${seconds}`
	};
}

export async function getYoutubeVideoInfoFromLink(url: string): Promise<Result<IYoutubeVideoInfo, "404" | GetVideoIDReason>> {
	let videoIDResult = getVideoIdFromYouTubeLink(url);

	if (!videoIDResult.success) {
		return { success: false, reason: videoIDResult.reason };
	}

	let response = await GlobalRequestHandler.sendRequest("GET", `https://www.youtube.com/oembed?url=${url}`);
	
	if (response?.status == 404) {
		return { success: false, reason: "404" };
	}
	
	let info = JSON.parse(response?.body) as IYoutubeVideoInfo;
	info.url = url;
	info.video_id = videoIDResult.result;

	return {
		success: true,
		result: info
	};
}

export async function getYoutubeVideoInfoFromVideoID(videoID: string): Promise<Result<IYoutubeVideoInfo | undefined, "INVALID_ID" | "404" | GetVideoIDReason>> {
	let link = getYouTubeLinkFromVideoID(videoID);

	if (!link.success) {
		return { success: false, reason: "INVALID_ID" };
	}
	
	return getYoutubeVideoInfoFromLink(link.result);
}

/**
 * Determines whether a YouTube video exists by checking the YouTube API.
 * @param url The url to check.
 * @returns True if the video in a YouTube url exists, otherwise False.
 */
export async function doesVideoExist(url: string): Promise<boolean> {
	return (await getYoutubeVideoInfoFromLink(url)).success;
}

/**
 * Determines whether a url contains a valid YouTube video ID. This does not check if the video exists, only if it is formatted correctly.
 * @param url The url to check.
 * @returns True if the url contains a valid formatted YouTube video ID, otherwise false. 
 */
export function urlContainsVideoID(url: string): boolean {
	return YOUTUBE_EXTRACT_VIDEO_ID_REGEX.test(url);
}
