import { Timestamp } from "../video/video";

export interface IVideoInfo {
	paused: boolean,
	currentTime: number,
	length: number
}

/**
 * Attempts to fetch information about the YouTube video the user is actively on.
 * This uses content scripts to access the page, specifically content_script.js.
 * @returns A IVideoInfo object containing information about the video.
 */
export async function getActiveVideoInfo(): Promise<IVideoInfo | null> {
	return new Promise((resolve, _reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
			chrome.tabs.sendMessage(currentTab.id!, { type: "pfy_get_active_info" },
				(response) => resolve(response)
			);
		})
	});
}

/**
 * Sets the current time of the video playing in the active tab the user is in.
 * @param seconds The time to set the video to.
 */
export function setCurrentVideoTime(seconds: number): void {
	chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
		chrome.tabs.sendMessage(currentTab.id!, { type: "pfy_set_video_position", data: seconds });
	})
}

/**
 * Adds small user clickable timestamp buttons to the currently playing video. 
 * @param timestamps The timestamps to add.
 */
export function setTimestampButtons(timestamps: Array<Timestamp>): void {
	chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
		chrome.tabs.sendMessage(currentTab.id!, { type: "pfy_set_timestamp_buttons", data: timestamps });
	})
}
