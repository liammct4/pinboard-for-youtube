export interface IVideoInfo {
	id: string;
	paused: boolean,
	currentTime: number,
	length: number
}

export type VideoScriptAction = 
	"pfy_set_video_position" |
	"pfy_get_active_info"

/**
 * Attempts to fetch information about the YouTube video the user is actively on.
 * This uses content scripts to access the page.
 * @returns A IVideoInfo object containing information about the video.
 */
export async function getActiveVideoInfo(): Promise<IVideoInfo | null> {
	let type: VideoScriptAction = "pfy_get_active_info";

	return new Promise((resolve, _reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
			chrome.tabs.sendMessage(currentTab.id!, { type },
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
	let type: VideoScriptAction = "pfy_set_video_position";

	chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
		chrome.tabs.sendMessage(currentTab.id!, { type, data: seconds });
	})
}
