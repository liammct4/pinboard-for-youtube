import { IConfig } from "./config/config"
import { TagDefinition, Video } from "./../video/video.ts"
import { ITempState } from "./tempState/tempState"
import { sampleConfigData } from "../../../testData/testDataSet.ts"
import { IAuthenticatedUser } from "../user/accounts.ts"
import { IPersistentState } from "./persistentState/persistentState.ts"
import AppThemes from "./../../styling/theme.json"

export interface IStorage {
	user_data: {
		videos: Array<Video>;
		tagDefinitions: Array<TagDefinition>;
		tagFilter: string;
		config: IConfig;
	},
	temp_state: ITempState;
	auth: {
		// This field indicates whether the user has logged in. If not logged in, this is null.
		currentUser: IAuthenticatedUser | undefined;
	},
	persistentState: IPersistentState;
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
				theme: theme,
				customThemes: []
			},
			tagDefinitions: [],
			tagFilter: ""
		},
		temp_state: {
			expandedVideos: [],
			layout: {
				isCurrentVideosSectionExpanded: true
			}
		},
		auth: {
			currentUser: undefined
		},
		persistentState: {
			path: undefined,
			resetPasswordState: undefined
		}
	};

	await chrome.storage.local.set(template);
}
