import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { settingsActions } from "./settingsSlice";
import { ExtensionVirtualStorage } from "../../lib/storage/virtualStorage";

export const settingsSyncStorageMiddleware = createListenerMiddleware();

settingsSyncStorageMiddleware.startListening({
	predicate: (action) => {
		if (action.type == settingsActions.updateSettingsSliceFromStorage.type) {
			return false;
		}

		return Object.values(settingsActions).find(x => x.type == action.type) != undefined;
	},
	effect: async (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;

		ExtensionVirtualStorage.modifyStorage((storage) => storage.userData.config.settings = state.settings.settings);
	}
});
