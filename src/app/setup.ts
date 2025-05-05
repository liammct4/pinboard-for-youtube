import { saveAuthSliceToStorage } from "../features/auth/authStorage";
import { saveCacheSliceToStorage } from "../features/cache/cacheStorage";
import { saveDirectorySliceToStorage } from "../features/directory/directoryStorage";
import { saveSettingsSliceToStorage } from "../features/settings/settingsStorage";
import { saveTempStateSliceToStorage } from "../features/state/tempStateStorage";
import { saveThemeSliceToStorage } from "../features/theme/themeStorage";
import { saveVideoSliceToStorage } from "../features/video/videoStorage";
import { accessStorage, modifyStorage } from "../lib/storage/storage";
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
	// TODO: replace setTimeout.
	let freeze: boolean = false;

	store.subscribe(() => modifyStorage(storage => {
		let state: RootState = store.getState();
	
		if (freeze) {
			return;
		}

		freeze = true;
	
		saveAuthSliceToStorage(storage, state.auth);
		saveCacheSliceToStorage(storage, state.cache);
		saveSettingsSliceToStorage(storage, state.settings);
		saveTempStateSliceToStorage(storage, state.tempState);
		saveThemeSliceToStorage(storage, state.theme);
		saveVideoSliceToStorage(storage, state.video);
		saveDirectorySliceToStorage(storage, state.directory);

		setTimeout(() => freeze = false, 100)
	}));

	chrome.storage.local.onChanged.addListener(async () => {	
		if (!freeze) {
			freeze = true;

			syncStoreToStorage();

			setTimeout(() => freeze = false, 100)
		}
	});
}
