import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { videoActions } from "./videoSlice";

export const videoSyncStorageMiddleware = createListenerMiddleware();

videoSyncStorageMiddleware.startListening({
	predicate: (action) => {
		if (action.type == videoActions.updateVideoSliceFromStorage.type) {
			return false;
		}

		return Object.values(videoActions).find(x => x.type == action.type) != undefined;
	},
	effect: (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;
		modifyStorage(storage => storage.userData.videos = state.video.videos);
	}
});
