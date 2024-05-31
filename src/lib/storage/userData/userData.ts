import { ITagDefinition, IVideo } from "../../video/video"
import { IStorage } from "../storage"

export async function getStoredVideos(): Promise<IVideo[]> {
	let storage = await chrome.storage.local.get() as IStorage;
	let videos: IVideo[] = storage.user_data.videos;

	return videos;
}

export async function setStoredVideos(videos: IVideo[]) {
	let storage = await chrome.storage.local.get() as IStorage;

	storage.user_data.videos = videos;

	await chrome.storage.local.set(storage);
}

/**
 * Retrieves the user defined tag definitions from storage.
 */
export async function getStorageTagDefinitions(): Promise<ITagDefinition[]> {
	let storage = await chrome.storage.local.get() as IStorage;

	return storage.user_data.tagDefinitions;
}

/**
 * Sets the tag definitions in storage.
 */
export async function setStorageTagDefinitions(tags: ITagDefinition[]): Promise<void> {
	let storage = await chrome.storage.local.get() as IStorage;
	storage.user_data.tagDefinitions = tags;

	await chrome.storage.local.set({ "user_data": storage.user_data });
}

/**
 * Retrieves the currently selected tag filter ID from storage.
 * @returns The tag filter ID in storage.
 */
export async function getStorageTagFilter(): Promise<string> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.user_data.tagFilter;
}

/**
 * Sets the single tag filter in storage.
 * @param tagFilterID The selected tag filter, this is ID's only, not names.
 */
export async function setStorageTagFilter(tagFilterID: string): Promise<void> {
	let storage = await chrome.storage.local.get() as IStorage;
	storage.user_data.tagFilter = tagFilterID;

	await chrome.storage.local.set({ "user_data": storage.user_data });
}
