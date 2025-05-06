import { accessStorage, getApplicationContextType, modifyStorage } from "../lib/storage/storage";
import { authActions } from "../features/auth/authSlice";
import { RootState, store } from "./store";
import { tempStateActions } from "../features/state/tempStateSlice";
import { themeActions } from "../features/theme/themeSlice";
import { settingsActions } from "../features/settings/settingsSlice";
import { cacheActions } from "../features/cache/cacheSlice";
import { videoActions } from "../features/video/videoSlice";
import { directoryActions } from "../features/directory/directorySlice";

export async function syncStoreToStorage() {
	let storage = await accessStorage();

	store.dispatch(tempStateActions.updateTempSliceFromStorage(storage));
	store.dispatch(themeActions.updateThemeSliceFromStorage(storage));
	store.dispatch(authActions.updateAuthSliceFromStorage(storage));
	store.dispatch(settingsActions.updateSettingsSliceFromStorage(storage));
	store.dispatch(cacheActions.updateCacheSliceFromStorage(storage));
	store.dispatch(videoActions.updateVideoSliceFromStorage(storage));
	store.dispatch(directoryActions.updateDirectorySliceFromStorage(storage));
}


export function setupStorageAndStoreSync() {
	chrome.storage.local.onChanged.addListener(async () => {	
		let storage = await chrome.storage.local.get();

		if (getApplicationContextType() == storage.meta.author) {
			return;
		}

		syncStoreToStorage();
	});
}
