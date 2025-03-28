import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addCustomTheme, deleteCustomTheme, setCurrentTheme, setCustomThemes } from "./themeSlice.ts";
import { swapAppTheme as changeAppTheme } from "../../lib/browser/extension/theme.ts";
import { RootState } from "../../app/store.ts";
import { modifyStorage } from "../../lib/storage/storage.ts";

export const updateThemeMiddleware = createListenerMiddleware();
export const updateStorageMiddleware = createListenerMiddleware();
export const updateCustomThemeStorageMiddleware = createListenerMiddleware();

updateThemeMiddleware.startListening({
	actionCreator: setCurrentTheme,
	effect: async (action, _listenerApi) => {
		changeAppTheme(action.payload);
	}
});

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
