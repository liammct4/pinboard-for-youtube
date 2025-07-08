import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { cacheActions, cacheSlice } from "./cacheSlice";
import { ExtensionLocalVirtualStorage } from "../../lib/storage/virtualStorage";

export const cacheSyncStorageMiddleware = createListenerMiddleware();

cacheSyncStorageMiddleware.startListening({
	predicate: (action) => {
		if (action.type == cacheActions.updateCacheSliceFromStorage.type) {
			return false;
		}

		return Object.values(cacheActions).find(x => x.type == action.type) != undefined;
	},
	effect: async (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;
		
		ExtensionLocalVirtualStorage.modifyStorage((storage) => {
			storage.cache.videos = state.cache.videoCache;

			if (!storage.meta.changed.includes(cacheSlice.name)) {
				storage.meta.changed.push(cacheSlice.name);
			}
		});
	}
});
