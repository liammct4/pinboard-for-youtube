import { configureStore } from "@reduxjs/toolkit"
import videoReducer from "../features/videos/videoSlice.ts"

export let store = configureStore({
	reducer: {
		video: videoReducer,
	}
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
