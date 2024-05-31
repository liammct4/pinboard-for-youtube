import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addTagDefinition, removeTagDefinition, setTagDefinitions, updateVideo } from "./videoSlice";
import { RootState } from "../../app/store";

export const tagCascadeUpdateMiddleware = createListenerMiddleware();

tagCascadeUpdateMiddleware.startListening({
	matcher: isAnyOf(addTagDefinition, removeTagDefinition, setTagDefinitions),
	effect: async (_action, listenerApi) => {
		let state: RootState = listenerApi.getState() as RootState;

		// Remove deleted tags for example.
		for (let video of state.video.currentVideos) {
			let newTags = video.appliedTags.filter(x => state.video.tagDefinitions.find(y => x == y.id));

			listenerApi.dispatch(updateVideo({
				id: video.id,
				timestamps: video.timestamps,
				appliedTags: newTags
			}));
		}
	}
});
