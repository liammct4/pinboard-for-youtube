import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addExpandedID, removeExpandedID, setLayoutState } from "./tempStateSlice";
import * as storageState from "../../lib/storage/tempState/tempState.ts"
import { modifyStorage } from "../../lib/storage/storage.ts";

export const addIDMiddleware = createListenerMiddleware();
export const removeIDMiddleware = createListenerMiddleware();
export const layoutStateUpdateMiddleware = createListenerMiddleware();

addIDMiddleware.startListening({
	actionCreator: addExpandedID,
	effect: async (action, _listenerApi) => {
		modifyStorage(s => s.temp_state.expandedVideos.push(action.payload));
	}
});

removeIDMiddleware.startListening({
	actionCreator: removeExpandedID,
	effect: async (action, _listenerApi) => {
		modifyStorage(s => s.temp_state.expandedVideos.splice(s.temp_state.expandedVideos.findIndex(x => x == action.payload), 1));
	}
});

layoutStateUpdateMiddleware.startListening({
	actionCreator: setLayoutState,
	effect: async (action, _listenerApi) => {
		modifyStorage(s => s.temp_state.layout = action.payload);
	}
})
