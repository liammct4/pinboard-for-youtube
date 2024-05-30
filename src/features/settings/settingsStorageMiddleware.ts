import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setSettingValues } from "./settingsSlice";
import { setUserSettingsStorage } from "../../lib/storage/config/config";

export const settingsStorageMiddleware = createListenerMiddleware();

settingsStorageMiddleware.startListening({
	actionCreator: setSettingValues,
	effect: (action) => {
		setUserSettingsStorage(action.payload);
	}
});
