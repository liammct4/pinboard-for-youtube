import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addCustomTheme, deleteCustomTheme, setCurrentTheme, setCustomThemes } from "./themeSlice.ts";
import { setStorageCustomThemes, setStorageTheme } from "../../lib/storage/config/theme/theme.ts";
import { swapAppTheme as changeAppTheme } from "../../lib/browser/extension/theme.ts";
import { RootState } from "../../app/store.ts";

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
		setStorageTheme(action.payload);
	}
});

updateCustomThemeStorageMiddleware.startListening({
	matcher: isAnyOf(addCustomTheme, deleteCustomTheme, setCustomThemes),
	effect: (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;

		setStorageCustomThemes(state.theme.customThemes);
	}
});
