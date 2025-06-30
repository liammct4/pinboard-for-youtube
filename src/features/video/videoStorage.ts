import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { videoActions, videoSlice } from "./videoSlice";
import { ExtensionMainVirtualStorage } from "../../lib/storage/virtualStorage";

export const videoSyncStorageMiddleware = createListenerMiddleware();

videoSyncStorageMiddleware.startListening({
	predicate: (action) => {
		if ([videoActions.updateVideoSliceFromStorage.type, videoActions.changeActiveVideoID.type].includes(action.type)) {
			return false;
		}

		return Object.values(videoActions).find(x => x.type == action.type) != undefined;
	},
	effect: async (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;

		ExtensionMainVirtualStorage.modifyStorage((storage) => {
			storage.userData.videos = state.video.videos;

			if (!storage.meta.changed.includes(videoSlice.name)) {
				storage.meta.changed.push(videoSlice.name);
			}
		});
	}
});
