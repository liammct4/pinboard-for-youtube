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
			chrome.tabs.sendMessage(currentTab.id!, { type: "get_active_info" },
				(response) => resolve(response)
			);
		})
	});
}
