import { convertArrayToMap } from "../../util/json/map";
import { TagDefinition, Video } from "../../video/video"
import { IStorage, getNestedStorageData } from "../storage"

export async function getStoredVideos(): Promise<Array<Video>> {
	let videos: Array<Video> = await getNestedStorageData("user_data/videos");

	if (videos == undefined) {
		throw new Error("Invalid operation, the user video data does not exist.");
	}

	return videos;
}

export async function getVideoFromIndex(index: number): Promise<Video> {
	let videos: Array<Video> = await getStoredVideos();

	if (index < 0 || index > videos.length) {
		throw new Error("Invalid argument provided, the index was out of range.");
	}

	return videos[index];
}

export async function getVideoFromVideoID(videoID: string): Promise<Video | null> {
	let videos: Array<Video> = await getStoredVideos();

	for (let i: number = 0; i < videos.length; i++) {
		if (videos[i].videoID == videoID) {
			return videos[i];
		}
	}

	return null;
}

export async function getIndexOfVideo(videoID: string) : Promise<number> {
	let [_, storageVideos] = await modifyStorageVideos();
	let index: number = storageVideos.findIndex((x) => x.videoID == videoID);

	return index;
}

async function modifyStorageVideos(): Promise<[any, Array<Video>]> {
	let userData: any = await chrome.storage.local.get("user_data");
	let storageVideos: Array<Video> = userData["user_data"]["videos"];

	return [userData, storageVideos];
}

export async function setStoredVideos(videos: Array<Video>) {
	let [userData, _storageVideos]: [any, Array<Video>] = await modifyStorageVideos();

	userData["user_data"]["videos"] = videos;

	await chrome.storage.local.set(userData);
}

export async function clearStoredVideos() {
	let [userData, storageVideos]: [any, Array<Video>] = await modifyStorageVideos();
	
	// Clears the array.
	storageVideos.length = 0;

	await chrome.storage.local.set(userData);
}

export async function pushVideoBatch(newVideos: Array<Video>): Promise<void> {
	let [userData, storageVideos]: [any, Array<Video>] = await modifyStorageVideos();

	// Replace any existing videos with new ones in the argument "newVideos".
	for (let i: number = 0; i < storageVideos.length; i++) {
		let video: Video = storageVideos[i];

		for (let j: number = 0; j < newVideos.length; j++) {
			if (video.videoID == newVideos[j].videoID) {
				storageVideos[i] = newVideos[j];

				newVideos.splice(j--, 1);
			}
		}
	}

	storageVideos.push(...newVideos);

	await chrome.storage.local.set(userData);
}

export async function pushVideo(video: Video): Promise<void> {
	await pushVideoBatch([ video ]);
}

export async function insertVideoBatch(index: number, videos: Array<Video>): Promise<void> {
	let [userData, storageVideos]: [any, Array<Video>] = await modifyStorageVideos();

	if (index == undefined || index < 0 || index > storageVideos.length) {
		throw new Error("Invalid argument provided, the index provided was invalid, index: {}.")
	}

	storageVideos.splice(index, 0, ...videos);
	
	await chrome.storage.local.set(userData);
}


export async function insertVideo(index: number, video: Video): Promise<void> {
	await insertVideoBatch(index, [ video ]);
}

export async function removeVideoByVideoID(videoID: string): Promise<boolean> {
	let [userData, storageVideos]: [any, Array<Video>] = await modifyStorageVideos();
	let index: number = storageVideos.findIndex((x) => x.videoID == videoID);

	if (index == -1) {
		return false;
	}

	storageVideos.splice(index, 1);
	
	await chrome.storage.local.set(userData);

	return true;
}

/**
 * Retrieves the user defined tag definitions from storage.
 */
export async function getStorageTagDefinitions(): Promise<Map<string, TagDefinition>> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return convertArrayToMap(storage.user_data.tagDefinitions, (item) => item.name);
}

/**
 * Sets the tag definitions in storage.
 */
export async function setStorageTagDefinitions(tags: Map<string, TagDefinition>): Promise<void> {
	let storage = await chrome.storage.local.get() as IStorage;

	let serializedArray: Array<TagDefinition> = [];
	let keys = tags.keys();

	for (let key of keys) {
		serializedArray.push(tags.get(key)!);
	}
	
	storage.user_data.tagDefinitions = serializedArray;

	await chrome.storage.local.set({ "user_data": storage.user_data });
}
