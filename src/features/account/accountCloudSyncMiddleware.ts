import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addVideo, clearVideos, removeVideo, setVideos, updateVideo } from "./../videos/videoSlice.ts";
import { RootState } from "../../app/store";

const accountCloudSyncMiddleware = createListenerMiddleware();

accountCloudSyncMiddleware.startListening({
	matcher: isAnyOf(addVideo, updateVideo, removeVideo, clearVideos, setVideos),
	effect: async (action, listenerApi) => {
		let state: RootState = listenerApi.getState() as RootState;

		// TODO: Send queue and updated videos to server for merging.
	}
});

export default accountCloudSyncMiddleware;
