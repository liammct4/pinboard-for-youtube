export interface ITempState {
	expandedVideos: Array<string>,
}

type StorageTemp = { temp_state: ITempState };

/**
 * Retrives the "temp_state" object from local storage in its entirety. 
 * @returns The "temp_state" in local storage.
 */
export async function getTempState(): Promise<ITempState> {
	let tempState: StorageTemp = await chrome.storage.local.get("temp_state") as StorageTemp;

	return tempState.temp_state;
}

/**
 * Retrieves the list of saved expanded videos in temp_state storage.
 * @returns An array of expanded videos.
 */
export async function getExpandedVideos(): Promise<Array<string>> {
	let tempState = await getTempState();

	return tempState.expandedVideos;
}

/**
 * Adds a video ID to the list of expanded videos in temporary storage.
 * 
 * Does nothing if the ID is already present.
 * @param videoID The ID to add.
 */
export async function addExpandedID(videoID: string): Promise<void> {
	let tempState: StorageTemp = await chrome.storage.local.get("temp_state") as StorageTemp;

	if (!tempState.temp_state.expandedVideos.includes(videoID)) {
		tempState.temp_state.expandedVideos.push(videoID);
	}

	await chrome.storage.local.set(tempState);
}

/**
 * Removes a video ID from the list of expanded videos in temporary storage.
 * 
 * Does nothing if the ID does not already exist.
 * @param videoID The ID to remove.
 */
export async function removeExpandedID(videoID: string): Promise<void> {
	let tempState: StorageTemp = await chrome.storage.local.get("temp_state") as StorageTemp;
	let index = tempState.temp_state.expandedVideos.findIndex(id => id == videoID);

	if (index != -1) {
		tempState.temp_state.expandedVideos.splice(index, 1);	
		
		await chrome.storage.local.set(tempState);
	}
}
