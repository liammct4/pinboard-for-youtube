import { configureStore } from "@reduxjs/toolkit"
import tempStateReducer from "../features/state/tempStateSlice.ts"
import themeReducer from "../features/theme/themeSlice.ts"
import authSlice from "../features/auth/authSlice.ts"
import settingsSlice from "../features/settings/settingsSlice.ts"
import cacheSlice from "../features/cache/cacheSlice.ts"
import { settingsStorageMiddleware } from "../features/settings/settingsStorageMiddleware.ts"
import { addIDMiddleware, layoutStateUpdateMiddleware, removeIDMiddleware } from "../features/state/stateStorageMiddleware.ts"
import { updateCustomThemeStorageMiddleware, updateStorageMiddleware } from "../features/theme/themeMiddleware.ts"
import { authChangeUserStorageMiddleware, authTokenChangedMiddleware } from "../features/auth/authStorageMiddleware.ts"
import { cacheSaveStorageMiddleware } from "../features/cache/cacheSaveStorageMiddleware.ts"

export let store = configureStore({
	reducer: {
		tempState: tempStateReducer,
		theme: themeReducer,
		auth: authSlice,
		settings: settingsSlice,
		cache: cacheSlice
	},
	devTools: true,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
		.prepend(addIDMiddleware.middleware)
		.prepend(removeIDMiddleware.middleware)
		.prepend(layoutStateUpdateMiddleware.middleware)
		.prepend(updateStorageMiddleware.middleware)
		.prepend(updateCustomThemeStorageMiddleware.middleware)
		.prepend(authChangeUserStorageMiddleware.middleware)
		.prepend(authTokenChangedMiddleware.middleware)
		.prepend(settingsStorageMiddleware.middleware)
		.prepend(cacheSaveStorageMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
