import { ITagDefinition, IVideo } from "../../video/video"
import { IStorage } from "../storage"

export async function getVideoDictionary(): Promise<Map<string, IVideo>> {
	let storage = await chrome.storage.local.get() as IStorage;
	let map = new Map<string, IVideo>();

	storage.user_data.videos.forEach(x => map.set(x.id, x));

	return map;
}

export async function saveVideoDictionaryToStorage(map: Map<string, IVideo>): Promise<void> {
	let storage = await chrome.storage.local.get() as IStorage;
	let videos: IVideo[] = [];

	for (const key of map.keys()) {
		videos.push(map.get(key)!);
	}

	storage.user_data.videos = videos;

	await chrome.storage.local.set(storage);
}


export async function setStoredVideos(videos: IVideo[]) {
	let storage = await chrome.storage.local.get() as IStorage;

	storage.user_data.videos = videos;

	await chrome.storage.local.set(storage);
}
