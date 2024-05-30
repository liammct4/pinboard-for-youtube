import { RootState } from "../../app/store";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addVideo, clearVideos, removeVideo, setVideos, updateVideo } from "./videoSlice";
import { appendMutationBatchToAccountQueue, appendMutationToAccountQueue } from "../account/accountSlice";
import { Video } from "../../lib/video/video";
import { userIsLoggedIn } from "../../lib/user/accounts";

export const videoQueueSyncVideoMiddleware = createListenerMiddleware();

videoQueueSyncVideoMiddleware.startListening({
	matcher: isAnyOf(addVideo, updateVideo, removeVideo, clearVideos, setVideos),
	effect: async (action, listenerApi) => {
		let state: RootState = listenerApi.getState() as RootState;

		// No need to queue anything to send to the server since there is no account.
		if (!await userIsLoggedIn()) {
			return;
		}

		// Each of the actions above can have different types of payload/argument so it needs to be separated.
		let affectedVideos: string | Video | Video[] | undefined = action.payload;

		if (affectedVideos == undefined) {
			// Means that all were affected.
			listenerApi.dispatch(appendMutationBatchToAccountQueue({
				dataMutationType: "TAG",
				info: state.video.currentVideos.map((item, index) => {
					return {
						mutationDataID: item.videoID,
						position: index
					}
				})
			}));		
		}
		else if (Array.isArray(affectedVideos)) {
			// Means that e.g. a set of videos were added.
			listenerApi.dispatch(appendMutationBatchToAccountQueue({
				dataMutationType: "VIDEO",
				info: affectedVideos.map((item, index) => {
					return {
						mutationDataID: item.videoID,
						position: index
					}
				})
			}));
		}
		else if (typeof affectedVideos == "string") {
			// Means that just an individual video was affected but only the ID was provided/necessary.
			listenerApi.dispatch(appendMutationToAccountQueue({
				dataMutationType: "VIDEO",
				mutationDataID: affectedVideos,
				position: state.video.currentVideos.findIndex(x => x.videoID == affectedVideos)
			}));
		}
		else {
			let casted = affectedVideos as Video;

			// Means that just an individual video was affected.
			listenerApi.dispatch(appendMutationToAccountQueue({
				dataMutationType: "VIDEO",
				mutationDataID: casted.videoID,
				position: state.video.currentVideos.findIndex(x => x.videoID == casted.videoID)
			}));
		}
	}
});
