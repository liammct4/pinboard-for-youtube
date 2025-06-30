import { accessLocalStorage, accessMainStorage, getApplicationContextType, ILocalStorage, IPrimaryStorage, modifyStorage } from "../lib/storage/storage";
import { authActions } from "../features/auth/authSlice";
import { RootState, store } from "./store";
import { tempStateActions } from "../features/state/tempStateSlice";
import { themeActions } from "../features/theme/themeSlice";
import { settingsActions } from "../features/settings/settingsSlice";
import { cacheActions } from "../features/cache/cacheSlice";
import { videoActions } from "../features/video/videoSlice";
import { directoryActions } from "../features/directory/directorySlice";

export async function syncStoreToMainStorage() {
	let mainStorage = await accessMainStorage();

	store.dispatch(tempStateActions.updateTempSliceFromStorage(mainStorage));
	store.dispatch(themeActions.updateThemeSliceFromStorage(mainStorage));
	store.dispatch(authActions.updateAuthSliceFromStorage(mainStorage));
	store.dispatch(settingsActions.updateSettingsSliceFromStorage(mainStorage));
	store.dispatch(videoActions.updateVideoSliceFromStorage(mainStorage));
	store.dispatch(directoryActions.updateDirectorySliceFromStorage(mainStorage));
}

export async function syncStoreToLocalStorage() {
	let localStorage = await accessLocalStorage();

	store.dispatch(cacheActions.updateCacheSliceFromStorage(localStorage));
}

export function setupStorageAndStoreSync() {
	chrome.storage.sync.onChanged.addListener(async () => {	
		let storage = await chrome.storage.sync.get() as IPrimaryStorage;

		if (getApplicationContextType() == storage.meta.author) {
			return;
		}

		syncStoreToMainStorage();
	});

	chrome.storage.local.onChanged.addListener(async () => {
		let storage = await chrome.storage.local.get() as ILocalStorage;

		if (getApplicationContextType() == storage.meta.author) {
			return;
		}

		syncStoreToLocalStorage();
	});
}
