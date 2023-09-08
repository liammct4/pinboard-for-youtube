import { configureStore } from "@reduxjs/toolkit"
import videoReducer from "../features/videos/videoSlice.ts"
import tempStateReducer from "../features/state/tempStateSlice.ts"
import tempStateMiddleware from "../features/state/stateStorageMiddleware.ts"
import videoStorageMiddleware from "../features/videos/videoStorageMiddleware.ts"
import videoTimelineMiddleware from "../features/videos/videoTimelineMiddlware.ts"
import themeMiddleware from "../features/theme/themeMiddleware.ts"
import themeReducer from "../features/theme/themeSlice.ts"

export let store = configureStore({
	reducer: {
		video: videoReducer,
		tempState: tempStateReducer,
		theme: themeReducer,
	},
	devTools: true,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
		.prepend(videoStorageMiddleware.middleware)
		.prepend(videoTimelineMiddleware.middleware)
		.prepend(tempStateMiddleware.addIDMiddleware.middleware)
		.prepend(tempStateMiddleware.removeIDMiddleware.middleware)
		.prepend(themeMiddleware.updateThemeMiddleware.middleware)
		.prepend(themeMiddleware.updateStorageMiddleware.middleware)
		.prepend(themeMiddleware.updateCustomThemeStorageMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
