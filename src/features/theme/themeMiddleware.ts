import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addCustomTheme, deleteCustomTheme, setCurrentTheme, setCustomThemes } from "./themeSlice.ts";
import { RootState } from "../../app/store.ts";
import { modifyStorage } from "../../lib/storage/storage.ts";

export const updateStorageMiddleware = createListenerMiddleware();
export const updateCustomThemeStorageMiddleware = createListenerMiddleware();

updateStorageMiddleware.startListening({
	actionCreator: setCurrentTheme,
	effect: async (action, _listenerApi) => {
		modifyStorage(s => s.user_data.config.theme = action.payload);
	}
});

updateCustomThemeStorageMiddleware.startListening({
	matcher: isAnyOf(addCustomTheme, deleteCustomTheme, setCustomThemes),
	effect: (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;

		modifyStorage(s => s.user_data.config.customThemes = state.theme.customThemes);
	}
});
