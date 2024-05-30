import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { pushAccountResourceData } from "../../lib/user/data/resource.ts";
import { TagDefinition, Video } from "../../lib/video/video.ts";
import { userIsLoggedIn } from "../../lib/user/accounts.ts";
import { DataMutation, ServerResourceType, appendMutationBatchToAccountQueue, appendMutationToAccountQueue, clearTagsAccountQueue, clearThemesAccountQueue, clearVideoAccountQueue, pushQueues } from "./accountSlice.ts";
import { HttpStatusCode } from "../../lib/util/http.ts";
import { setVideoQueueStorage } from "../../lib/user/queue/queueStorage.ts";
import { AppTheme } from "../../lib/config/theming/appTheme.ts";

export const accountCloudSyncMiddleware = createListenerMiddleware();

// TODO: refactor all handling of resource data into one.
async function handleSyncing<T>(
	resource: ServerResourceType,
	idToken: string,
	mutationQueue: DataMutation[],
	baseData: T[],
	grabID: (item: T) => string,
	clearDataAccountQueue: () => void
) {
	if (mutationQueue.length > 0) {
		let targetedData: T[] = baseData
			.filter(x => mutationQueue.findIndex(y => y.dataID == grabID(x)) != -1);
		
		let videosResponse = await pushAccountResourceData(
			resource,
			idToken,
			mutationQueue,
			targetedData
		);
		
		/* Clear the appropriate queue. */
		// Clears the queue from storage as well.
		if (videosResponse?.status == HttpStatusCode.OK) {
			clearDataAccountQueue();
			await setVideoQueueStorage([]);
		}
		else {
			// Something went wrong, so save to storage. 
			await setVideoQueueStorage(mutationQueue);
		}
	}
}

accountCloudSyncMiddleware.startListening({
	matcher: isAnyOf(appendMutationToAccountQueue, appendMutationBatchToAccountQueue, pushQueues),
	effect: async (_action, listenerApi) => {
		if (!userIsLoggedIn()) {
			return;
		}

		let state: RootState = listenerApi.getState() as RootState;
		let idToken = state.auth.currentUser!.tokens.IdToken;

		// Filters the current videos by what has been requested in the queue.
		handleSyncing<Video>(
			"VIDEO",
			idToken,
			state.account.updatedVideoIDsQueue,
			state.video.currentVideos,
			(video) => video.videoID,
			() => listenerApi.dispatch(clearVideoAccountQueue())
		);
		
		handleSyncing<TagDefinition>(
			"TAG",
			idToken,
			state.account.updatedTagIDsQueue,
			state.video.tagDefinitions,
			(tag) => tag.id,
			() => listenerApi.dispatch(clearTagsAccountQueue())
		);

		handleSyncing<AppTheme>(
			"THEME",
			idToken,
			state.account.updatedThemeIDsQueue,
			state.theme.customThemes,
			(theme) => theme.id,
			() => listenerApi.dispatch(clearThemesAccountQueue())
		)
	}
});
