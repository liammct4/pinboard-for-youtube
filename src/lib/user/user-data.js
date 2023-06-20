var validate = require('jsonschema').validate;

const USER_DATA_KEY = "user_data";

const VIDEO_JSON_SCHEMA = {
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

const VIDEO_ARRAY_JSON_SCHEMA  = {
	"$schema": "https://json-schema.org/draft/2020-12/schema",
	"type": "array",
	"items": VIDEO_JSON_SCHEMA
}

const STORAGE_JSON_SCHEMA = {
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

export async function ensureInitialized() {
	// Storage is empty if not initialized.
	let storage = await chrome.storage.local.get();

	if (Object.keys(storage).length == 0) {
		let template = {
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

async function getNestedStorageData(path) {
	let data = await chrome.storage.local.get();
	let keys = path.split(/[\/\\]/).filter(x => x != "");

	let current = data[keys[0]];

	if (current == undefined) {
		return undefined;
	}

	for (let i = 1; i < keys.length; i++) {
		current = current[keys[i]];

		if (current == undefined) {
			return undefined;
		}
	}

	return current;
}

export async function getStoredVideos() {
	let videos = await getNestedStorageData(`${USER_DATA_KEY}/videos`);

	if (videos == undefined) {
		throw new Error("Invalid operation, the user video data does not exist.");
	}

	return videos;
}

export async function getVideoFromIndex(index) {
	let videos = await getStoredVideos();

	if (index < 0 || index > videos.length) {
		throw new Error("Invalid argument provided, the index was out of range.");
	}

	return videos[index];
}

export async function getVideoFromVideoID(videoID) {
	let videos = await getStoredVideos();

	for (let i = 0; i < videos.length; i++) {
		if (videos[i].videoID == videoID) {
			return videos[i];
		}
	}

	return null;
}

export async function getIndexOfVideo(videoID) {
	let [userData, storageVideos] = await modifyStorageVideos();
	let index = storageVideos.findIndex((x) => x.videoID == videoID);

	return index;
}

export async function getUserConfig() {
	let config = await getNestedStorageData(`${USER_DATA_KEY}/config`);

	if (config == undefined) {
		throw new Error("Invalid operation, the user config data does not exist.");
	}

	return config;
}

async function modifyStorageVideos() {
	let userData = await chrome.storage.local.get(USER_DATA_KEY);
	let storageVideos = userData[USER_DATA_KEY]["videos"];

	return [userData, storageVideos];
}

export async function pushVideoBatch(newVideos) {
	if (!validate(newVideos, VIDEO_ARRAY_JSON_SCHEMA).valid) {
		throw new Error("Invalid argument provided, attempted to add a set of newVideos which were not in the correct format.");
	}

	let [userData, storageVideos] = await modifyStorageVideos();

	if (!validate(newVideos, VIDEO_ARRAY_JSON_SCHEMA).valid) {
		throw new Error("Invalid argument provided, newVideos was in an invalid format.");
	}

	// Replace any existing videos with new ones in the argument "newVideos".
	for (let i = 0; i < storageVideos.length; i++) {
		let video = storageVideos[i];

		for (let j = 0; j < newVideos.length; j++) {
			if (video.videoID == newVideos[j].videoID) {
				storageVideos[i] = newVideos[j];

				newVideos.splice(j--, 1);
			}
		}
	}

	storageVideos.push(...newVideos);

	await chrome.storage.local.set(userData);
}

export async function pushVideo(video) {
	if (!validate(video, VIDEO_JSON_SCHEMA).valid) {
		throw new Error("Invalid argument provided, attempted to add a video which was not in the correct format.");
	}

	await pushVideoBatch([ video ]);
}

export async function insertVideoBatch(index, videos) {
	if (!validate(videos, VIDEO_ARRAY_JSON_SCHEMA).valid) {
		throw new Error("Invalid argument provided, attempted to insert a set of videos which were not in the correct format.");
	}

	let [userData, storageVideos] = await modifyStorageVideos();

	if (index == undefined || index < 0 || index > storageVideos.length) {
		throw new Error("Invalid argument provided, the index provided was invalid, index: {}.")
	}

	storageVideos.splice(index, 0, ...videos);
	
	await chrome.storage.local.set(userData);
}


export async function insertVideo(index, video) {
	if (!validate(video, VIDEO_JSON_SCHEMA).valid) {
		throw new Error("Invalid argument provided, attempted to insert a video which was not in the correct format.");
	}

	await insertVideoBatch(index, [ video ]);
}

export async function removeVideoByVideoID(videoID) {
	let [userData, storageVideos] = await modifyStorageVideos();
	let index = storageVideos.findIndex((x) => x.videoID == videoID);

	if (index == -1) {
		return false;
	}

	storageVideos.splice(index, 1);
	
	await chrome.storage.local.set(userData);

	return true;
}
