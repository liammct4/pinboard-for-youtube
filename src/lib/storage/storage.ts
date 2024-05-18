import { IConfig } from "./config/config"
import { TagDefinition, Video } from "./../video/video.ts"
import { ITempState } from "./tempState/tempState"
import { sampleConfigData } from "../../../testData/testDataSet.ts"
import { IAuthenticatedUser } from "../user/accounts.ts"
import { IPersistentState } from "./persistentState/persistentState.ts"
import AppThemes from "./../../styling/theme.json"
import { DataMutation } from "../../features/account/accountSlice.ts"
import settingDefinitions from "./../config/settingDefinitions.json"
import { SettingValue } from "../../features/settings/settingsSlice.ts"

export interface IStorage {
	user_data: {
		videos: Video[];
		tagDefinitions: TagDefinition[];
		tagFilter: string;
		config: IConfig;
	},
	temp_state: ITempState;
	auth: {
		// This field indicates whether the user has logged in. If not logged in, this is null.
		currentUser: IAuthenticatedUser | undefined;
	},
	persistentState: IPersistentState;
	account: {
		mutationQueues: {
			videoPendingQueue: DataMutation[],
			tagPendingQueue: DataMutation[]
		}
	}
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

	let defaultUserSettings: SettingValue[] = settingDefinitions.map(x => {
		return { settingName: x.settingName, value: x.defaultValue.toString() };
	});

	let blankTemplate: IStorage = {
		user_data: {
			videos: [],
			config: {
				theme: theme,
				customThemes: [],
				userSettings: defaultUserSettings
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
			resetPasswordState: undefined,
			resendVerificationEmailState: undefined
		},
		account: {
			mutationQueues: {
				tagPendingQueue: [],
				videoPendingQueue: []
			}
		}
	};

	await chrome.storage.local.set(blankTemplate);
}
