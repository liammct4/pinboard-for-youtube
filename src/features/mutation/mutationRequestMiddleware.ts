import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { IMutationQueues, modifyStorage } from "../../lib/storage/storage";
import { appendRequestToDirectory, appendRequestToThemes, appendRequestToVideos, clearMutationQueues } from "./mutationSlice";
import { DataMutation } from "../../components/features/useUserAccount";
import { sendApiRequestWithAuthorization } from "../../lib/user/resource";
import { IAuthenticatedUser } from "../../lib/user/accounts";
import { HttpStatusCode } from "../../lib/util/http";
import { RootState, store } from "../../app/store";
import { directoriesEndpoint, themesEndpoint, videosEndpoint } from "../../lib/api/pinboardApi";

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

			if (await pushMutationQueue(state.auth.currentUser, videosEndpoint, state.mutation.videoPendingQueue)) {
				storage.account.mutationQueues.videoPendingQueue = [];
			}
			else {
				storage.account.mutationQueues.videoPendingQueue = state.mutation.videoPendingQueue;
			}
		
			if (await pushMutationQueue(state.auth.currentUser, directoriesEndpoint, state.mutation.directoryPendingQueue)) {
				storage.account.mutationQueues.directoryPendingQueue = [];
			}
			else {
				storage.account.mutationQueues.directoryPendingQueue = state.mutation.directoryPendingQueue
			}

			if (await pushMutationQueue(state.auth.currentUser, themesEndpoint, state.mutation.themePendingQueue)) {
				storage.account.mutationQueues.themePendingQueue = [];
			}
			else {
				storage.account.mutationQueues.themePendingQueue = state.mutation.themePendingQueue
			}
		});
	}
});
