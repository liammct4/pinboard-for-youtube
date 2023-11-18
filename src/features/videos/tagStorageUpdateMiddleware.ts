import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addTagDefinition, removeTagDefinition, setTagDefinitions, setTagFilter, updateVideo } from "./videoSlice";
import { RootState } from "../../app/store";
import { setStorageTagDefinitions, setStorageTagFilter } from "../../lib/storage/userData/userData";

const tagStorageUpdateUpdateMiddleware = createListenerMiddleware();
const tagFilterUpdateMiddleware = createListenerMiddleware();

tagStorageUpdateUpdateMiddleware.startListening({
	matcher: isAnyOf(addTagDefinition, removeTagDefinition, setTagDefinitions),
	effect: async (_action, listenerApi) => {
		let state: RootState = listenerApi.getState() as RootState;

		await setStorageTagDefinitions(state.video.tagDefinitions);
	}
});

tagFilterUpdateMiddleware.startListening({
	actionCreator: setTagFilter,
	effect: async (action, _listenerApi) => {
		await setStorageTagFilter(action.payload);
	}
})

export default { tagStorageUpdateUpdateMiddleware, tagFilterUpdateMiddleware };
