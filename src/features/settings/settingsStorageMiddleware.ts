import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setSettingValues } from "./settingsSlice";
import { setUserSettingsStorage } from "../../lib/storage/config/config";

let settingsStorageMiddleware = createListenerMiddleware();

settingsStorageMiddleware.startListening({
	actionCreator: setSettingValues,
	effect: (action) => {
		setUserSettingsStorage(action.payload);
	}
});

export { settingsStorageMiddleware };
