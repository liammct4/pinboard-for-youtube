import { validate } from "jsonschema"

interface IVideoJsonSchema {
	type: string,
	properties: {
		videoID: {
			type: string
		},
		timestamps: {
			type: string,
			items: {
				type: string,
				properties: {
					time: {
						type: string
					},
					message: {
						type: string
					}
				},
				required: Array<string>
			}
		}
	},
	required: Array<string>	
}

interface IVideoArrayJsonSchema {
	$schema: string,
	type: string,
	items: IVideoJsonSchema
}

interface IStorageJsonSchema {
	$schema: string,
	type: string,
	properties: {
		user_data: {
			type: string,
			properties: {
				videos: IVideoArrayJsonSchema,
				config: {
					type: string
				}
			},
			required: Array<string>
		}
	},
	required: Array<string>
}

export type Timestamp = {
	time: number;
	message: string;
}

export type Video = {
	videoID: string;
	timestamps: Array<Timestamp>;
}

// TODO: Add config options.
export interface IConfig { }

export interface IStorage {
	user_data: {
		videos: Array<Video>,
		config: IConfig
	}
}

const USER_DATA_KEY: string = "user_data";

const VIDEO_JSON_SCHEMA: IVideoJsonSchema = {
	"type": "object",
	"properties": {
		"videoID": {
			"type": "string"
		},
		"timestamps": {
			"type": "array",
			"items": {
				"type": "object",
				"properties": {
					"time": {
						"type": "integer"
					},
					"message": {
						"type": "string"
					}
				},
				"required": [ "time", "message" ]
			}
		}
	},
	"required": [ "videoID", "timestamps" ]
}

const VIDEO_ARRAY_JSON_SCHEMA: IVideoArrayJsonSchema = {
	"$schema": "https://json-schema.org/draft/2020-12/schema",
	"type": "array",
	"items": VIDEO_JSON_SCHEMA
}

const STORAGE_JSON_SCHEMA: IStorageJsonSchema = {
	"$schema": "https://json-schema.org/draft/2020-12/schema",
	"type": "object",
	"properties": {
		"user_data": {
			"type": "object",
			"properties": {
				"videos": VIDEO_ARRAY_JSON_SCHEMA,
				"config": {
					"type": "object",
				}
			},
			"required": [ "videos" ]
		}
	},
	"required": [ "user_data" ]
};

export async function ensureInitialized(): Promise<void> {
	// Storage is empty if not initialized.
	let storage: any = await chrome.storage.local.get();

	if (Object.keys(storage).length == 0) {
		let template: IStorage = {
			"user_data": {
				"videos": [],
				"config": {

				}
			}
		};

		await chrome.storage.local.set(template);
	}
	else if (!validate(storage, STORAGE_JSON_SCHEMA).valid) {
		throw new Error("The data stored in local storage was in an invalid format, the data may have possibly been corrupted or externally modified.");
	}
}

async function getNestedStorageData(path: string): Promise<any> {
	let data: any = await chrome.storage.local.get();
	let keys: Array<string> = path.split(/[\/\\]/).filter(x => x != "");

	let current: string = data[keys[0]];

	if (current == undefined) {
		return undefined;
	}

	for (let i: number = 1; i < keys.length; i++) {
		let nextKey: any = keys[i];
		current = current[nextKey];

		if (current == undefined) {
			return undefined;
		}
	}

	return current;
}

export async function getStoredVideos(): Promise<Array<Video>> {
	let videos: Array<Video> = await getNestedStorageData(`${USER_DATA_KEY}/videos`);

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

export async function getUserConfig(): Promise<IConfig> {
	let config: IConfig = await getNestedStorageData(`${USER_DATA_KEY}/config`);

	if (config == undefined) {
		throw new Error("Invalid operation, the user config data does not exist.");
	}

	return config;
}

async function modifyStorageVideos(): Promise<[any, Array<Video>]> {
	let userData: any = await chrome.storage.local.get(USER_DATA_KEY);
	let storageVideos: Array<Video> = userData[USER_DATA_KEY]["videos"];

	return [userData, storageVideos];
}

export async function setStoredVideos(videos: Array<Video>) {
	let [userData, storageVideos]: [any, Array<Video>] = await modifyStorageVideos();

	userData[USER_DATA_KEY]["videos"] = videos;

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

	if (!validate(newVideos, VIDEO_ARRAY_JSON_SCHEMA).valid) {
		throw new Error("Invalid argument provided, newVideos was in an invalid format.");
	}

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
	if (!validate(video, VIDEO_JSON_SCHEMA).valid) {
		throw new Error("Invalid argument provided, attempted to add a video which was not in the correct format.");
	}

	await pushVideoBatch([ video ]);
}

export async function insertVideoBatch(index: number, videos: Array<Video>): Promise<void> {
	if (!validate(videos, VIDEO_ARRAY_JSON_SCHEMA).valid) {
		throw new Error("Invalid argument provided, attempted to insert a set of videos which were not in the correct format.");
	}

	let [userData, storageVideos]: [any, Array<Video>] = await modifyStorageVideos();

	if (index == undefined || index < 0 || index > storageVideos.length) {
		throw new Error("Invalid argument provided, the index provided was invalid, index: {}.")
	}

	storageVideos.splice(index, 0, ...videos);
	
	await chrome.storage.local.set(userData);
}


export async function insertVideo(index: number, video: Video): Promise<void> {
	if (!validate(video, VIDEO_JSON_SCHEMA).valid) {
		throw new Error("Invalid argument provided, attempted to insert a video which was not in the correct format.");
	}

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
