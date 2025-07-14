import { IVideo } from "./../video/video.ts"
import { ITempState } from "./tempState/tempState"
import { IAuthenticatedUser } from "../user/accounts.ts"
import { IPersistentState } from "./persistentState/persistentState.ts"
import { IYoutubeVideoInfo } from "../util/youtube/youtubeUtil.ts"
import { createNode, DirectoryTree, IDirectoryNode } from "../directory/directory.ts"
import { DataMutation } from "../../components/features/useUserAccount.ts"
import { IAppTheme } from "../config/theming/appTheme.ts"
import { IConfig } from "./config.ts"
import { defaultSettings } from "../config/settings.ts"
import { deepMerge } from "../util/objects/objects.ts"
import { AppThemes, DEFAULT_THEME } from "../../styling/themes.ts"

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

export const ROOT_NODE_ID = "cd108e87-e3fb-41cf-b5e2-d9d4ef8824e0:NODE";

let rootNode: IDirectoryNode = {
	slice: "$",
	nodeID: ROOT_NODE_ID,
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
			theme: DEFAULT_THEME,
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
			timestampStyle: "FULL",
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
	cache: {
		videos: []
	},
	meta: {
		author: getApplicationContextType(),
		changed: []
	}
};

export async function ensureInitialized(): Promise<void> {
	// Storage is empty if not initialized.
	let storage: IStorage | {} | undefined = await chrome.storage.local.get();

	deepMerge(storage, BLANK_STORAGE_TEMPLATE);
	await chrome.storage.local.set(storage);
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

	storage.meta.author = getApplicationContextType();

	await chrome.storage.local.set(storage);
}
