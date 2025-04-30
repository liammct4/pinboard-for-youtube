import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { IMutationQueues, modifyStorage } from "../../lib/storage/storage";
import { appendRequestToDirectory, appendRequestToThemes, appendRequestToVideos, clearDirectoryQueue, clearMutationQueues, clearThemeQueue, clearVideoQueue } from "./mutationSlice";
import { DataMutation } from "../../components/features/useUserAccount";
import { sendApiRequestWithAuthorization } from "../../lib/user/resource";
import { IAuthenticatedUser } from "../../lib/user/accounts";
import { HttpStatusCode } from "../../lib/util/http";
import { RootState, store } from "../../app/store";
import { directoriesEndpoint, themesEndpoint, videosEndpoint } from "../../lib/api/pinboardApi";
import { IVideo } from "../../lib/video/video";
import { IDirectoryModificationAction } from "../../components/features/resources/useDirectoryResource";
import { IAppTheme } from "../../lib/config/theming/appTheme";

export const mutationRequestMiddleware = createListenerMiddleware();

async function pushMutationQueue<T>(
		user: IAuthenticatedUser,
		url: string,
		queue: DataMutation<T>[]
	): Promise<boolean> {
	if (queue.length == 0) {
		return false;
	}

	let request = JSON.stringify(queue);

	let response = await sendApiRequestWithAuthorization(user.tokens.IdToken, "PATCH", url, request);

	return response != undefined && response.status == HttpStatusCode.OK;
}

mutationRequestMiddleware.startListening({
	matcher: isAnyOf(appendRequestToVideos, appendRequestToDirectory, appendRequestToThemes),
	effect: (_action, listenerApi) => {
		let state = listenerApi.getState() as RootState;

		modifyStorage(async storage => {
			if (state.auth.currentUser == undefined) {
				listenerApi.dispatch(clearMutationQueues());
				return;
			}

			// Video.
			if (state.mutation.videoPendingQueue.length > 0) {
				let videoQueue: DataMutation<IVideo>[];

				if (await pushMutationQueue(state.auth.currentUser, videosEndpoint, state.mutation.videoPendingQueue)) {
					listenerApi.dispatch(clearVideoQueue());
					videoQueue = [];
				}
				else {
					videoQueue = state.mutation.videoPendingQueue;
				}
	
				storage.account.mutationQueues.videoPendingQueue = videoQueue;
			}
			
			// Directory.
			if (state.mutation.directoryPendingQueue.length > 0) {
				let directoryQueue: DataMutation<IDirectoryModificationAction>[];

				if (await pushMutationQueue(state.auth.currentUser, directoriesEndpoint, state.mutation.directoryPendingQueue)) {
					listenerApi.dispatch(clearDirectoryQueue());
					directoryQueue = [];
				}
				else {
					directoryQueue = state.mutation.directoryPendingQueue
				}

				storage.account.mutationQueues.directoryPendingQueue = directoryQueue;
			}

			// Theme.
			if (state.mutation.themePendingQueue.length > 0) {
				let themeQueue: DataMutation<IAppTheme>[];

				if (await pushMutationQueue(state.auth.currentUser, themesEndpoint, state.mutation.themePendingQueue)) {
					listenerApi.dispatch(clearThemeQueue());
					themeQueue = [];
				}
				else {
					themeQueue = state.mutation.themePendingQueue;
				}

				storage.account.mutationQueues.themePendingQueue = themeQueue;
			}
		});
	}
});
