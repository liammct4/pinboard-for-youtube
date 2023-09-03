import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setCurrentTheme } from "./themeSlice.ts";
import { setStorageTheme } from "../../lib/storage/config/theme/theme.ts";
import { swapAppTheme as changeAppTheme } from "../../lib/browser/extension/theme.ts";
import { changeYouTubeTimestampTheme } from "../../lib/browser/youtube.ts";

const updateThemeMiddleware = createListenerMiddleware();
const updateStorageMiddleware = createListenerMiddleware();

updateThemeMiddleware.startListening({
	actionCreator: setCurrentTheme,
	effect: async (action, _listenerApi) => {
		changeAppTheme(action.payload);
		
		// Updates the timeline buttons.
		changeYouTubeTimestampTheme(action.payload);
	}
});

updateStorageMiddleware.startListening({
	actionCreator: setCurrentTheme,
	effect: async (action, _listenerApi) => {
		setStorageTheme(action.payload);
	}
});

export default { updateThemeMiddleware, updateStorageMiddleware };
