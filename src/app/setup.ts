import { updateAuthSliceFromStorage } from "../features/auth/authSlice";
import { saveAuthSliceToStorage } from "../features/auth/authStorage";
import { updateCacheSliceFromStorage } from "../features/cache/cacheSlice";
import { saveCacheSliceToStorage } from "../features/cache/cacheStorage";
import { saveDirectorySliceToStorage } from "../features/directory/directoryStorage";
import { updateSettingsSliceFromStorage } from "../features/settings/settingsSlice";
import { saveSettingsSliceToStorage } from "../features/settings/settingsStorage";
import { updateTempSliceFromStorage } from "../features/state/tempStateSlice";
import { saveTempStateSliceToStorage } from "../features/state/tempStateStorage";
import { updateThemeSliceFromStorage } from "../features/theme/themeSlice";
import { saveThemeSliceToStorage } from "../features/theme/themeStorage";
import { updateVideoSliceFromStorage } from "../features/video/videoSlice";
import { saveVideoSliceToStorage } from "../features/video/videoStorage";
import { accessStorage, modifyStorage } from "../lib/storage/storage";
import { RootState, store } from "./store";

export async function syncStoreToStorage() {
	let storage = await accessStorage();

	store.dispatch(updateTempSliceFromStorage(storage));
	store.dispatch(updateThemeSliceFromStorage(storage));
	store.dispatch(updateAuthSliceFromStorage(storage));
	store.dispatch(updateSettingsSliceFromStorage(storage));
	store.dispatch(updateCacheSliceFromStorage(storage));
	store.dispatch(updateVideoSliceFromStorage(storage));
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
