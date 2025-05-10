import { themeActions } from "./themeSlice";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { modifyStorage } from "../../lib/storage/storage";
import { ExtensionVirtualStorage } from "../../lib/storage/virtualStorage";

export const themeStorageSyncMiddleware = createListenerMiddleware();

themeStorageSyncMiddleware.startListening({
	predicate: (action) => {
		if (action.type == themeActions.updateThemeSliceFromStorage.type) {
			return false;
		}

		return Object.values(themeActions).find(x => x.type == action.type) != undefined;
	},
	effect: (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;

		ExtensionVirtualStorage.storage = {
			...ExtensionVirtualStorage.storage,
			userData: {
				...ExtensionVirtualStorage.storage.userData,
				config: {
					...ExtensionVirtualStorage.storage.userData.config,
					customThemes: state.theme.customThemes,
					theme: state.theme.currentTheme
				}
			}
		};
	}
});
