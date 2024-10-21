import { createListenerMiddleware } from "@reduxjs/toolkit";
import { saveVideoToCache } from "./cacheSlice.ts";
import { addToVideoStorageCache, getVideoCacheFromStorage } from "../../lib/storage/cache/cache.ts";
import { RootState } from "../../app/store.ts";

export const cacheSaveStorageMiddleware = createListenerMiddleware();

cacheSaveStorageMiddleware.startListening({
	actionCreator: saveVideoToCache,
	effect: async (action, listenerApi) => {
		let state: RootState = listenerApi.getState() as RootState;
		let storageCache = await getVideoCacheFromStorage();

		if (storageCache.findIndex(x => x.video_id == action.payload.video_id) == -1) {
			addToVideoStorageCache(action.payload);
		}
	}
});
