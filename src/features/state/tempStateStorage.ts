import { tempStateActions } from "./tempStateSlice";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { ExtensionVirtualStorage } from "../../lib/storage/virtualStoarge";

export const tempStateSyncStorageMiddleware = createListenerMiddleware();

tempStateSyncStorageMiddleware.startListening({
	predicate: (action) => {
		if (action.type == tempStateActions.updateTempSliceFromStorage.type) {
			return false;
		}

		return Object.values(tempStateActions).find(x => x.type == action.type) != undefined;
	},
	effect: (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;

		ExtensionVirtualStorage.storage = {
			...ExtensionVirtualStorage.storage,
			tempState: {
				expandedVideos: state.tempState.expandedVideoIDs,
				currentDirectoryPath: state.tempState.currentDirectory,
				layout: state.tempState.layout,
				videoBrowserScrollDistance: state.tempState.videoBrowserScrollDistance
			}
		};
	}
});
