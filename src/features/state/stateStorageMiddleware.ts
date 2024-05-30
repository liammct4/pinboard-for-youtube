import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addExpandedID, removeExpandedID, setLayoutState } from "./tempStateSlice";
import * as storageState from "../../lib/storage/tempState/tempState.ts"

export const addIDMiddleware = createListenerMiddleware();
export const removeIDMiddleware = createListenerMiddleware();
export const layoutStateUpdateMiddleware = createListenerMiddleware();

addIDMiddleware.startListening({
	actionCreator: addExpandedID,
	effect: async (action, _listenerApi) => {
		await storageState.addExpandedID(action.payload);
	}
});

removeIDMiddleware.startListening({
	actionCreator: removeExpandedID,
	effect: async (action, _listenerApi) => {
		await storageState.removeExpandedID(action.payload);
	}
});

layoutStateUpdateMiddleware.startListening({
	actionCreator: setLayoutState,
	effect: async (action, _listenerApi) => {
		await storageState.setLayoutState(action.payload);
	}
})
