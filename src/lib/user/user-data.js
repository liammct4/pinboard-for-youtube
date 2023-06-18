var validate = require('jsonschema').validate;

const USER_DATA_KEY = "user_data";
const STORAGE_JSON_SCHEMA = {
	"$schema": "https://json-schema.org/draft/2020-12/schema",
	"type": "object",
	"properties": {
		"user_data": {
			"type": "object",
			"properties": {
				"videos": {
					"type": "array",
					"items": {
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
				},
				"config": {
					"type": "object",
				}
			},
			"required": [ "videos" ]
		}
	},
	"required": [ "user_data" ]
};

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

export async function getUserConfig() {
	let config = await getNestedStorageData(`${USER_DATA_KEY}/config`);

	if (config == undefined) {
		throw new Error("Invalid operation, the user config data does not exist.");
	}

	return config;
}

export async function ensureInitialized() {
	// Empty if not initialized.
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
	else if (!(validate(storage, STORAGE_JSON_SCHEMA)).valid) {
		throw new Error("The data stored in local storage was in an invalid format, the data may have possibly been corrupted or externally modified.");
	}
}
