import { configureStore } from "@reduxjs/toolkit"
import tempStateReducer from "../features/state/tempStateSlice.ts"
import themeReducer from "../features/theme/themeSlice.ts"
import authSlice from "../features/auth/authSlice.ts"
import settingsSlice from "../features/settings/settingsSlice.ts"
import cacheSlice from "../features/cache/cacheSlice.ts"
import mutationSlice from "../features/mutation/mutationSlice.ts"
import videoSlice from "../features/video/videoSlice.ts"
import directorySlice from "../features/directory/directorySlice.ts"
import { mutationRequestMiddleware } from "../features/mutation/mutationRequestMiddleware.ts"
import { addVideoMiddleware } from "../features/directory/directoryAccountMiddleware.ts"

export let store = configureStore({
	reducer: {
		tempState: tempStateReducer,
		theme: themeReducer,
		auth: authSlice,
		settings: settingsSlice,
		cache: cacheSlice,
		mutation: mutationSlice,
		video: videoSlice,
		directory: directorySlice
	},
	devTools: true,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
		.prepend(mutationRequestMiddleware.middleware)
		.prepend(addVideoMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
