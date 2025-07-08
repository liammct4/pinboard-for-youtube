import { accessLocalStorage, accessMainStorage, getApplicationContextType, IMetaStorage } from "../lib/storage/storage";
import { authActions, authSlice } from "../features/auth/authSlice";
import { store } from "./store";
import { tempStateActions, tempStateSlice } from "../features/state/tempStateSlice";
import { themeActions, themeSlice } from "../features/theme/themeSlice";
import { settingsActions, settingsSlice } from "../features/settings/settingsSlice";
import { cacheActions, cacheSlice } from "../features/cache/cacheSlice";
import { videoActions, videoSlice } from "../features/video/videoSlice";
import { directoryActions, directorySlice } from "../features/directory/directorySlice";
import { ExtensionLocalVirtualStorage, ExtensionMainVirtualStorage } from "../lib/storage/virtualStorage";

export async function syncStoreToMainStorage(onlyUpdateWhenChanged: boolean) {
	let mainStorage = await accessMainStorage();

	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(tempStateSlice.name)) store.dispatch(tempStateActions.updateTempSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(themeSlice.name)) store.dispatch(themeActions.updateThemeSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(authSlice.name)) store.dispatch(authActions.updateAuthSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(settingsSlice.name)) store.dispatch(settingsActions.updateSettingsSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(videoSlice.name)) store.dispatch(videoActions.updateVideoSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(directorySlice.name)) store.dispatch(directoryActions.updateDirectorySliceFromStorage(mainStorage));
	
	mainStorage.meta.changed = [];
	chrome.storage.sync.set(mainStorage);
}

export async function syncStoreToLocalStorage(onlyUpdateWhenChanged: boolean) {
	let localStorage = await accessLocalStorage();

	if (!onlyUpdateWhenChanged || localStorage.meta.changed.includes(cacheSlice.name)) store.dispatch(cacheActions.updateCacheSliceFromStorage(localStorage));
}

export function setupStorageAndStoreSync() {
	const syncListener = async (storageArea: any, delayTime: number, sync: (onlyUpdateWhenChanged: boolean) => void) => {
		let storage = await storageArea.get() as IMetaStorage;

		if (storage.meta.changed.length == 0) {
			return;
		}

		if (getApplicationContextType() == storage.meta.author) {
			// Since the end of the sync method never runs which resets the changed array.
			setTimeout(() => {
				storage.meta.changed = [];
				storageArea.set(storage);
			}, delayTime * 2);
			return;
		}

		sync(true);
	}

	chrome.storage.sync.onChanged.addListener(() => syncListener(chrome.storage.sync, ExtensionMainVirtualStorage.delayTime, syncStoreToMainStorage));
	chrome.storage.local.onChanged.addListener(() => syncListener(chrome.storage.local, ExtensionLocalVirtualStorage.delayTime, syncStoreToLocalStorage));
}
