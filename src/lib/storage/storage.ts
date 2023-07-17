import { IConfig } from "./config"
import { IVideoArrayJsonSchema, VIDEO_ARRAY_JSON_SCHEMA } from "./user-data"
import { Video } from "../video/video"
import { ITempState } from "./tempState"

export interface IStorage {
	user_data: {
		videos: Array<Video>,
		config: IConfig
	},
	temp_state: ITempState
}

export interface IStorageJsonSchema {
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
		},
		temp_state: {
			type: string,
			properties: {
				expandedVideos: {
					type: string,
					items: {
						type: string
					}
				}
			},
			required: Array<string>
		}
	},
	required: Array<string>
}

export const STORAGE_JSON_SCHEMA: IStorageJsonSchema = {
	"$schema": "https://json-schema.org/draft/2020-12/schema",
	type: "object",
	properties: {
		user_data: {
			type: "object",
			properties: {
				videos: VIDEO_ARRAY_JSON_SCHEMA,
				config: {
					type: "object",
				}
			},
			required: [ "videos" ]
		},
		temp_state: {
			type: "object",
			properties: {
				expandedVideos: {
					type: "array",
					items: {
						type: "string"
					}
				}
			},
			required: [ "expandedVideos" ]
		}
	},
	required: [ "user_data", "temp_state" ]
};

export async function getNestedStorageData(path: string): Promise<any> {
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

export async function ensureInitialized(): Promise<void> {
	// Storage is empty if not initialized.
	let storage: any = await chrome.storage.local.get();

	if (Object.keys(storage).length == 0) {
		let template: IStorage = {
			user_data: {
				videos: [],
				config: {

				}
			},
			temp_state: {
				expandedVideos: []
			}
		};

		await chrome.storage.local.set(template);
	}
}
