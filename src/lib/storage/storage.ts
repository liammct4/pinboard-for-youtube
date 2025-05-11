import { IVideo } from "./../video/video.ts"
import { ITempState } from "./tempState/tempState"
import { sampleConfigData } from "../../../testData/testDataSet.ts"
import { IAuthenticatedUser } from "../user/accounts.ts"
import { IPersistentState } from "./persistentState/persistentState.ts"
import AppThemes from "./../../styling/theme.json"
import { settingDefinitions } from "../config/settingDefinitions.ts"
import { SettingValue } from "../../features/settings/settingsSlice.ts"
import { IYoutubeVideoInfo } from "../util/youtube/youtubeUtil.ts"
import { createNode, DirectoryTree, IDirectoryNode } from "../directory/directory.ts"
import { DataMutation } from "../../components/features/useUserAccount.ts"
import { IAppTheme } from "../config/theming/appTheme.ts"
import { IConfig } from "./config.ts"
import { IDirectoryModificationAction } from "../user/resources/directory.ts"

export interface IMutationQueues {
	videoPendingQueue: DataMutation<IVideo>[],
	themePendingQueue: DataMutation<IAppTheme>[],
	directoryPendingQueue: DataMutation<IDirectoryModificationAction>[]
}

export type StorageAuthorSources = "CONTENT_SCRIPT" | "EXTENSION";

export interface IMetaStorage {
	meta: {
		author: StorageAuthorSources;
	}
}

export interface IStorage extends IMetaStorage {
	userData: {
		videos: {
			[videoID: string]: IVideo | undefined
		};
		directory: DirectoryTree;
		config: IConfig;
	},
	tempState: ITempState;
	auth: {
		currentUser: IAuthenticatedUser | undefined;
	},
	persistentState: IPersistentState;
	account: {
		mutationQueues: IMutationQueues;
	},
	cache: {
		videos: IYoutubeVideoInfo[]
	}
}

let defaultUserSettings: SettingValue[] = settingDefinitions.map(x => {
	return { settingName: x.settingName, value: x.defaultValue.toString() };
});

let rootNode: IDirectoryNode = {
	slice: "$",
	nodeID: createNode(),
	subNodes: []
}

export const BLANK_STORAGE_TEMPLATE: IStorage = {
	userData: {
		videos: {},
		directory: {
			rootNode: rootNode.nodeID,
			directoryNodes: {
				[rootNode.nodeID]: rootNode
			},
			videoNodes: {}
		},
		config: {
			theme: AppThemes == undefined ? sampleConfigData.theme : AppThemes[0],
			customThemes: [],
			userSettings: defaultUserSettings
		}
	},
	tempState: {
		expandedVideos: [],
		videoBrowserScrollDistance: 0,
		currentDirectoryPath: "$",
		layout: {
			isCurrentVideosSectionExpanded: true,
			videoItemViewStyle: "MINIMAL",
			isDirectoryBrowserSettingsExpanded: false
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
		videos: [],
	},
	meta: {
		author: "EXTENSION"
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

const EXTENSION_URL_REGEX = /\w*-extension:(\\\\|\/\/)[\w\-]+/;

export function getApplicationContextType(): StorageAuthorSources {
	if (EXTENSION_URL_REGEX.test(window.location.href)) {
		return "EXTENSION";
	}

	return "CONTENT_SCRIPT";
}

export async function modifyStorage(modifier: (s: IStorage) => void): Promise<void> {
	let storage = await accessStorage();

	modifier(storage);

	storage.meta.author = getApplicationContextType();

	await chrome.storage.local.set(storage);
}
