import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { settingsActions } from "./settingsSlice";

export const settingsSyncStorageMiddleware = createListenerMiddleware();

settingsSyncStorageMiddleware.startListening({
	predicate: (action) => {
		if (action.type == settingsActions.updateSettingsSliceFromStorage.type) {
			return false;
		}

		return Object.values(settingsActions).find(x => x.type == action.type) != undefined;
	},
	effect: (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;
		modifyStorage(storage => storage.userData.config.userSettings = state.settings.settingValues);
	}
});
