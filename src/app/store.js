import { configureStore } from "@reduxjs/toolkit"
import videoReducer from "../features/videos/videoSlice.js"

export let store = configureStore({
	reducer: {
		video: videoReducer
	}
})

export default store;
