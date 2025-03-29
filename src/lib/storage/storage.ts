import { ITagDefinition, IVideo } from "./../video/video.ts"
import { ITempState } from "./tempState/tempState"
import { sampleConfigData } from "../../../testData/testDataSet.ts"
import { IAuthenticatedUser } from "../user/accounts.ts"
import { IPersistentState } from "./persistentState/persistentState.ts"
import AppThemes from "./../../styling/theme.json"
import settingDefinitions from "./../config/settingDefinitions.json"
import { SettingValue } from "../../features/settings/settingsSlice.ts"
import { IYoutubeVideoInfo } from "../util/youtube/youtubeUtil.ts"
import { IDirectoryNode } from "../../components/video/navigation/directory.ts"
import { DataMutation } from "../../components/features/useUserAccount.ts"
import { IAppTheme } from "../config/theming/appTheme.ts"
import { IDirectoryModificationAction } from "../../components/features/resources/useDirectoryResource.ts"
import { IConfig } from "./config.ts"

export interface IStorage {
	user_data: {
		videos: IVideo[];
		directoryRoot: IDirectoryNode;
		tagDefinitions: ITagDefinition[];
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
			videoPendingQueue: DataMutation<IVideo>[],
			themePendingQueue: DataMutation<IAppTheme>[],
			directoryPendingQueue: DataMutation<IDirectoryModificationAction>[]
		}
	},
	cache: {
		videos: IYoutubeVideoInfo[]
	}
}

let defaultUserSettings: SettingValue[] = settingDefinitions.map(x => {
	return { settingName: x.settingName, value: x.defaultValue.toString() };
});

export const BLANK_STORAGE_TEMPLATE: IStorage = {
	user_data: {
		videos: [],
		directoryRoot: {
			nodeID: crypto.randomUUID(),
			slice: "$",
			type: "DIRECTORY",
			parent: null,
			subNodes: []
		},
		config: {
			theme: AppThemes == undefined ? sampleConfigData.theme : AppThemes[0],
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
			themePendingQueue: [],
			videoPendingQueue: [],
			directoryPendingQueue: []
		}
	},
	cache: {
		videos: []
	}
};

export async function ensureInitialized(): Promise<void> {
	// Storage is empty if not initialized.
	let storage: IStorage | {} | undefined = await chrome.storage.local.get();

	if (Object.keys(storage).length != 0) {
		return;
	}

	await chrome.storage.local.set(BLANK_STORAGE_TEMPLATE);
}

export async function getItemFromStorage<T>(accessor: (storage: IStorage) => T): Promise<T> {
	let storage = await chrome.storage.local.get() as IStorage;

	return accessor(storage);
}

export async function accessStorage(): Promise<IStorage> {
	let storage = await chrome.storage.local.get() as IStorage;

	return storage;
}

export async function modifyStorage(modifier: (s: IStorage) => void): Promise<void> {
	let storage = await accessStorage();

	modifier(storage);

	await chrome.storage.local.set(storage);
}
