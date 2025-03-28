import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setSettingValues } from "./settingsSlice";
import { modifyStorage } from "../../lib/storage/storage";

export const settingsStorageMiddleware = createListenerMiddleware();

settingsStorageMiddleware.startListening({
	actionCreator: setSettingValues,
	effect: (action) => {
		modifyStorage(s => s.user_data.config.userSettings = action.payload);
	}
});
