import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addVideo, clearVideos, setVideos, updateVideo } from "./videoSlice";
import { RootState } from "../../app/store";
import { setStoredVideos } from "../../lib/storage/userData/userData";

const videoStorageMiddleware = createListenerMiddleware();

videoStorageMiddleware.startListening({
	matcher: isAnyOf(addVideo, updateVideo, clearVideos, setVideos),
	effect: async (_action, listenerApi) => {
		let state: RootState = listenerApi.getState() as RootState;

		await setStoredVideos(state.video.currentVideos);
	}
});

export default videoStorageMiddleware;
