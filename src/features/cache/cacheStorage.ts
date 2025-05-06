import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { cacheActions } from "./cacheSlice";
import { ExtensionVirtualStorage } from "../../lib/storage/virtualStoarge";

export const cacheSyncStorageMiddleware = createListenerMiddleware();

cacheSyncStorageMiddleware.startListening({
	predicate: (action) => {
		if (action.type == cacheActions.updateCacheSliceFromStorage.type) {
			return false;
		}

		return Object.values(cacheActions).find(x => x.type == action.type) != undefined;
	},
	effect: (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;
		ExtensionVirtualStorage.storage = {
			...ExtensionVirtualStorage.storage,
			cache: {
				videos: state.cache.videoCache
			}
		};
	}
});
