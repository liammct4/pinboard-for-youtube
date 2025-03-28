import { createListenerMiddleware } from "@reduxjs/toolkit";
import { saveVideoToCache } from "./cacheSlice.ts";
import { RootState } from "../../app/store.ts";
import { accessStorage, modifyStorage } from "../../lib/storage/storage.ts";

export const cacheSaveStorageMiddleware = createListenerMiddleware();

cacheSaveStorageMiddleware.startListening({
	actionCreator: saveVideoToCache,
	effect: async (action, _listenerApi) => {		
		modifyStorage((s) => {
			if (s.cache.videos.findIndex(x => x.video_id == action.payload.video_id) == -1) {
				s.cache.videos.push(action.payload);
			}
		});
	}
});
