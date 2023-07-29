import { configureStore } from "@reduxjs/toolkit"
import videoReducer from "../features/videos/videoSlice.ts"
import tempStateReducer from "../features/state/tempStateSlice.ts"
import tempStateMiddleware from "../features/state/stateStorageMiddleware.ts"
import videoStorageMiddleware from "../features/videos/videoStorageMiddleware.ts"
import videoTimelineMiddleware from "../features/videos/videoTimelineMiddlware.ts"

export let store = configureStore({
	reducer: {
		video: videoReducer,
		tempState: tempStateReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
		.prepend(videoStorageMiddleware.middleware)
		.prepend(videoTimelineMiddleware.middleware)
		.prepend(tempStateMiddleware.addIDMiddleware.middleware)
		.prepend(tempStateMiddleware.removeIDMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
