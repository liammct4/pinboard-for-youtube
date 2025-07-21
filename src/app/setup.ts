import { accessStorage, getApplicationContextType, IMetaStorage, IStorage } from "../lib/storage/storage";
import { authActions, authSlice } from "../features/auth/authSlice";
import { store } from "./store";
import { tempStateActions, tempStateSlice } from "../features/state/tempStateSlice";
import { themeActions, themeSlice } from "../features/theme/themeSlice";
import { settingsActions, settingsSlice } from "../features/settings/settingsSlice";
import { cacheActions, cacheSlice } from "../features/cache/cacheSlice";
import { videoActions, videoSlice } from "../features/video/videoSlice";
import { directoryActions, directorySlice } from "../features/directory/directorySlice";
import { contentScriptID, ExtensionVirtualStorage } from "../lib/storage/virtualStorage";

export async function syncStoreToStorage(onlyUpdateWhenChanged: boolean) {
	let mainStorage = await accessStorage();

	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(tempStateSlice.name)) store.dispatch(tempStateActions.updateTempSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(themeSlice.name)) store.dispatch(themeActions.updateThemeSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(authSlice.name)) store.dispatch(authActions.updateAuthSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(settingsSlice.name)) store.dispatch(settingsActions.updateSettingsSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(videoSlice.name)) store.dispatch(videoActions.updateVideoSliceFromStorage(mainStorage));
	
	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(directorySlice.name)) store.dispatch(directoryActions.updateDirectorySliceFromStorage(mainStorage));

	if (!onlyUpdateWhenChanged || mainStorage.meta.changed.includes(cacheSlice.name)) store.dispatch(cacheActions.updateCacheSliceFromStorage(mainStorage));
	
	mainStorage.meta.changed = [];
	chrome.storage.local.set(mainStorage);
}

export function setupStorageAndStoreSync() {
	chrome.storage.local.onChanged.addListener(async () => {	
		let storage = await chrome.storage.local.get() as IStorage;

		let modifiedFromDifferentScript = getApplicationContextType() == "CONTENT_SCRIPT" && storage.meta.authorScript != contentScriptID;
		
		if (modifiedFromDifferentScript || getApplicationContextType() != storage.meta.author) {
			syncStoreToStorage(true);
		}
		else {
			// Since the end of the sync method never runs which resets the changed array.
			setTimeout(() => {
				storage.meta.changed = [];
				chrome.storage.local.set(storage);
			}, ExtensionVirtualStorage.delayTime * 2);
		}
	});
}
