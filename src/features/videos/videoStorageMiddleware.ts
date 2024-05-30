import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addVideo, clearVideos, removeVideo, setVideos, setVideosWithoutQueue, updateVideo } from "./videoSlice";
import { RootState } from "../../app/store";
import { setStoredVideos } from "../../lib/storage/userData/userData";

export const videoStorageMiddleware = createListenerMiddleware();

videoStorageMiddleware.startListening({
	matcher: isAnyOf(addVideo, updateVideo, removeVideo, clearVideos, setVideos, setVideosWithoutQueue),
	effect: async (_action, listenerApi) => {
		let state: RootState = listenerApi.getState() as RootState;

		await setStoredVideos(state.video.currentVideos);
	}
});
