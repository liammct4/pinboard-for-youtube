import { IStorage } from "../../lib/storage/storage";
import { directoryActions, IDirectorySlice } from "./directorySlice";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { ExtensionVirtualStorage } from "../../lib/storage/virtualStorage";

export const directorySyncStorageMiddleware = createListenerMiddleware();

directorySyncStorageMiddleware.startListening({
	predicate: (action) => {
		if (action.type == directoryActions.updateDirectorySliceFromStorage.type) {
			return false;
		}

		return Object.values(directoryActions).find(x => x.type == action.type) != undefined;
	},
	effect: async (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;

		ExtensionVirtualStorage.modifyStorage((storage) => storage.userData.directory = state.directory.videoBrowser);
	}
});
