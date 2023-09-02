import { IConfig } from "./config/config"
import { Video } from "./../video/video.ts"
import { ITempState } from "./tempState/tempState"
import AppThemes from "./../../styling/theme.json"
import { sampleConfigData } from "../../../testData/testDataSet.ts"

export interface IStorage {
	user_data: {
		videos: Array<Video>,
		config: IConfig
	},
	temp_state: ITempState
}

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

	if (Object.keys(storage).length != 0) {
		return;
	}

	let theme = null;

	if (AppThemes == undefined) {
		theme = sampleConfigData.theme;
	}
	else {
		theme = AppThemes[0];
	}

	let template: IStorage = {
		user_data: {
			videos: [],
			config: {
				theme: theme
			},
		},
		temp_state: {
			expandedVideos: []
		}
	};

	await chrome.storage.local.set(template);
}
