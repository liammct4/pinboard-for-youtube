import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { pushAccountVideos } from "../../lib/user/data/videos.ts";
import { TagDefinition, Video } from "../../lib/video/video.ts";
import { userIsLoggedIn } from "../../lib/user/accounts.ts";
import { appendMutationBatchToAccountQueue, appendMutationToAccountQueue, clearTagsAccountQueue, clearVideoAccountQueue, pushQueues } from "./accountSlice.ts";
import { HttpStatusCode } from "../../lib/util/http.ts";
import { pushAccountTagDefinitions } from "../../lib/user/data/tags.ts";
import { setTagQueueStorage, setVideoQueueStorage } from "../../lib/user/queue/queueStorage.ts";

const accountCloudSyncMiddleware = createListenerMiddleware();

accountCloudSyncMiddleware.startListening({
	matcher: isAnyOf(appendMutationToAccountQueue, appendMutationBatchToAccountQueue, pushQueues),
	effect: async (_action, listenerApi) => {
		if (!userIsLoggedIn()) {
			return;
		}

		let state: RootState = listenerApi.getState() as RootState;

		// Filters the current videos by what has been requested in the queue.
		if (state.account.updatedVideoIDsQueue.length > 0) {
			let targetedVideos: Video[] = state.video.currentVideos
				.filter(x => state.account.updatedVideoIDsQueue.findIndex(y => y.dataID == x.videoID) != -1);
			
			let videosResponse = await pushAccountVideos(
				state.auth.currentUser!.tokens.IdToken,
				state.account.updatedVideoIDsQueue,
				targetedVideos
			);
			
			// Handle queue, clears it from storage as well.
			if (videosResponse?.status == HttpStatusCode.OK) {
				listenerApi.dispatch(clearVideoAccountQueue());
				await setVideoQueueStorage([]);
			}
			else {
				// Something went wrong, so save to storage. 
				await setVideoQueueStorage(state.account.updatedVideoIDsQueue);
			}
		}
		
		if (state.account.updatedTagIDsQueue.length > 0) {
			let targetedTags: TagDefinition[] = state.video.tagDefinitions
				.filter(x => state.account.updatedTagIDsQueue.findIndex(y => y.dataID == x.id) != -1);

			let tagsResponse = await pushAccountTagDefinitions(
				state.auth.currentUser!.tokens.IdToken,
				state.account.updatedTagIDsQueue,
				targetedTags
			);
			
			if (tagsResponse?.status == HttpStatusCode.OK) {
				listenerApi.dispatch(clearTagsAccountQueue());
				await setTagQueueStorage([]);
			}
			else {
				await setTagQueueStorage(state.account.updatedTagIDsQueue);
			}
		}
	}
});

export default accountCloudSyncMiddleware;
