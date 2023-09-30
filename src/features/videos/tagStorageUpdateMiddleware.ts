import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addTagDefinition, removeTagDefinition, setTagDefinitions, updateVideo } from "./videoSlice";
import { RootState } from "../../app/store";
import { setStorageTagDefinitions } from "../../lib/storage/userData/userData";

const tagStorageUpdateUpdateMiddleware = createListenerMiddleware();

tagStorageUpdateUpdateMiddleware.startListening({
	matcher: isAnyOf(addTagDefinition, removeTagDefinition, setTagDefinitions),
	effect: async (_action, listenerApi) => {
		let state: RootState = listenerApi.getState() as RootState;

		await setStorageTagDefinitions(state.video.tagDefinitions);
	}
});

export default tagStorageUpdateUpdateMiddleware;
