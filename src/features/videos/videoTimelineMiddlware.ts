import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { clearVideos, setVideos, updateVideo } from "./videoSlice";
import { RootState } from "../../app/store";
import { Video } from "../../lib/video/video";
import { setTimestampButtons } from "../../lib/browser/youtube";

const videoTimelineMiddleware = createListenerMiddleware();

videoTimelineMiddleware.startListening({
	matcher: isAnyOf(updateVideo, clearVideos, setVideos),
	effect: async (_action, listenerApi) => {
		let state: RootState = listenerApi.getState() as RootState;
		let activeVideo: Video | undefined = state.video.currentVideos.find(v => v.videoID == state.video.activeVideoID);

		if (activeVideo != undefined) {
			setTimestampButtons(activeVideo.timestamps);
		}
	}
});

export default videoTimelineMiddleware;
