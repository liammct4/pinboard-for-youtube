import { configureStore } from "@reduxjs/toolkit"
import tempStateReducer from "../features/state/tempStateSlice.ts"
import themeReducer from "../features/theme/themeSlice.ts"
import authSlice from "../features/auth/authSlice.ts"
import settingsSlice from "../features/settings/settingsSlice.ts"
import cacheSlice from "../features/cache/cacheSlice.ts"

export let store = configureStore({
	reducer: {
		tempState: tempStateReducer,
		theme: themeReducer,
		auth: authSlice,
		settings: settingsSlice,
		cache: cacheSlice,
	},
	devTools: true,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
