import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { pushAccountVideos } from "../../lib/user/data/videos.ts";
import { Video } from "../../lib/video/video.ts";
import { userIsLoggedIn } from "../../lib/user/accounts.ts";
import { appendVideoBatchToAccountQueue, appendVideoToAccountQueue, clearTagsAccountQueue, clearVideoAccountQueue } from "./accountSlice.ts";
import { HttpStatusCode } from "../../lib/util/http.ts";

const accountCloudSyncMiddleware = createListenerMiddleware();

accountCloudSyncMiddleware.startListening({
	matcher: isAnyOf(appendVideoToAccountQueue, appendVideoBatchToAccountQueue),
	effect: async (action, listenerApi) => {
		if (!userIsLoggedIn()) {
			return;
		}

		let state: RootState = listenerApi.getState() as RootState;

		// Filters the current videos by what has been requested in the queue.
		let targetedVideos: Video[] = state.video.currentVideos
			.filter(x => state.account.updatedVideoIDsQueue.findIndex(y => y.videoID == x.videoID) != -1)

		let response = await pushAccountVideos(
			state.auth.currentUser!.tokens.IdToken,
			state.account.updatedVideoIDsQueue,
			targetedVideos
		);

		if (response?.status == HttpStatusCode.OK) {
			listenerApi.dispatch(clearVideoAccountQueue());
			listenerApi.dispatch(clearTagsAccountQueue());
		}
	}
});

export default accountCloudSyncMiddleware;
