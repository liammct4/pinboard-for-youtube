import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { videoActions } from "./videoSlice";
import { ExtensionVirtualStorage } from "../../lib/storage/virtualStorage";

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

		ExtensionVirtualStorage.storage = {
			...ExtensionVirtualStorage.storage,
			userData: {
				...ExtensionVirtualStorage.storage.userData,
				videos: state.video.videos
			}
		};
	}
});
