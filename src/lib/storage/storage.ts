import { IVideo } from "./../video/video.ts"
import { ITempState } from "./tempState/tempState"
import { sampleConfigData } from "../../../testData/testDataSet.ts"
import { IAuthenticatedUser } from "../user/accounts.ts"
import { IPersistentState } from "./persistentState/persistentState.ts"
import AppThemes from "./../../styling/theme.json"
import { IYoutubeVideoInfo } from "../util/youtube/youtubeUtil.ts"
import { createNode, DirectoryTree, IDirectoryNode } from "../directory/directory.ts"
import { DataMutation } from "../../components/features/useUserAccount.ts"
import { IAppTheme } from "../config/theming/appTheme.ts"
import { IConfig } from "./config.ts"
import { defaultSettings } from "../config/settings.ts"
import { deepMerge } from "../util/objects/objects.ts"

export interface IMutationQueues {
	videoPendingQueue: DataMutation<IVideo>[],
	themePendingQueue: DataMutation<IAppTheme>[]
}

export type StorageAuthorSources = "CONTENT_SCRIPT" | "EXTENSION" | "DEVMODE";

export interface IMetaStorage {
	meta: {
		author: StorageAuthorSources;
		changed: string[];
	}
}

export interface ILocalStorage extends IMetaStorage {
	cache: {
		videos: IYoutubeVideoInfo[]
	}
}

export interface IPrimaryStorage extends IMetaStorage {
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
	}
}

let rootNode: IDirectoryNode = {
	slice: "$",
	nodeID: createNode(),
	subNodes: []
}

const EXTENSION_URL_REGEX = /\w*-extension:(\\\\|\/\/)[\w\-]+/;

export function getApplicationContextType(): StorageAuthorSources {
	if (EXTENSION_URL_REGEX.test(window.location.href)) {
		return "EXTENSION";
	}
	else if (window.location.href.startsWith("http://localhost:")) {
		return "DEVMODE";
	}

	return "CONTENT_SCRIPT";
}

export const BLANK_LOCAL_STORAGE_TEMPLATE: ILocalStorage = {
	cache: {
		videos: []
	},
	meta: {
		author: getApplicationContextType(),
		changed: []
	}
}

export const BLANK_MAIN_STORAGE_TEMPLATE: IPrimaryStorage = {
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
			settings: defaultSettings
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
		}
	},
	meta: {
		author: getApplicationContextType(),
		changed: []
	}
};

export async function ensureInitialized(): Promise<void> {
	// Storage is empty if not initialized.
	let mainStorage: IPrimaryStorage | {} | undefined = await chrome.storage.sync.get();
	let localStorage: ILocalStorage | {} | undefined = await chrome.storage.local.get();

	deepMerge(mainStorage, BLANK_MAIN_STORAGE_TEMPLATE);
	deepMerge(localStorage, BLANK_LOCAL_STORAGE_TEMPLATE);

	(mainStorage as IPrimaryStorage).userData.config.customThemes.forEach(x => deepMerge(x.palette, AppThemes[0].palette));

	await chrome.storage.sync.set(mainStorage);
	await chrome.storage.local.set(localStorage);
}

export async function getItemFromStorage<T>(accessor: (storage: IPrimaryStorage) => T): Promise<T> {
	let storage = await chrome.storage.sync.get() as IPrimaryStorage;

	return accessor(storage);
}

export async function accessMainStorage(): Promise<IPrimaryStorage> {
	let storage = await chrome.storage.sync.get() as IPrimaryStorage;

	return storage;
}

export async function accessLocalStorage(): Promise<ILocalStorage> {
	let storage = await chrome.storage.local.get() as ILocalStorage;

	return storage;
}

export async function modifyStorage(modifier: (s: IPrimaryStorage) => void): Promise<void> {
	let storage = await accessMainStorage();

	modifier(storage);

	storage.meta.author = getApplicationContextType();

	await chrome.storage.sync.set(storage);
}
