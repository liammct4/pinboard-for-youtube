import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { authActions, authSlice } from "./authSlice";

export const authSyncStorageMiddleware = createListenerMiddleware();

authSyncStorageMiddleware.startListening({
	predicate: (action) => {
		if (action.type == authActions.updateAuthSliceFromStorage.type) {
			return false;
		}

		return Object.values(authActions).find(x => x.type == action.type) != undefined;
	},
	effect: (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;
		modifyStorage(storage => storage.auth.currentUser = state.auth.currentUser);
	}
});
