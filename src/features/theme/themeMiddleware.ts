import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setCurrentTheme } from "./themeSlice.ts";
import { setStorageTheme } from "../../lib/storage/config/theme/theme.ts";
import { swapAppTheme } from "../../lib/browser/extension/theme.ts";

const updateThemeMiddleware = createListenerMiddleware();
const updateStorageMiddleware = createListenerMiddleware();

updateThemeMiddleware.startListening({
	actionCreator: setCurrentTheme,
	effect: async (action, _listenerApi) => {
		swapAppTheme(action.payload);
	}
});

updateStorageMiddleware.startListening({
	actionCreator: setCurrentTheme,
	effect: async (action, _listenerApi) => {
		setStorageTheme(action.payload);
	}
});

export default { updateThemeMiddleware, updateStorageMiddleware };
