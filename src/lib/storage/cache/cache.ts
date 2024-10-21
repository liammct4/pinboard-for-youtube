import { IYoutubeVideoInfo } from "../../util/youtube/youtubeUtil";
import { IStorage } from "../storage";

export async function getVideoCacheFromStorage(): Promise<IYoutubeVideoInfo[]> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.cache.videos;
}

export async function addToVideoStorageCache(info: IYoutubeVideoInfo): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	storage.cache.videos.push(info);

	await chrome.storage.local.set(storage);
}
