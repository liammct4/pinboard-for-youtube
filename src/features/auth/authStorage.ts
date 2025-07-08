import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { authActions, authSlice } from "./authSlice";
import { ExtensionMainVirtualStorage } from "../../lib/storage/virtualStorage";

export const authSyncStorageMiddleware = createListenerMiddleware();

authSyncStorageMiddleware.startListening({
	predicate: (action) => {
		if (action.type == authActions.updateAuthSliceFromStorage.type) {
			return false;
		}

		return Object.values(authActions).find(x => x.type == action.type) != undefined;
	},
	effect: async (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;

		ExtensionMainVirtualStorage.modifyStorage((storage) => {
			storage.auth.currentUser = state.auth.currentUser;
			
			if (!storage.meta.changed.includes(authSlice.name)) {
				storage.meta.changed.push(authSlice.name);
			}
		});
	}
});
