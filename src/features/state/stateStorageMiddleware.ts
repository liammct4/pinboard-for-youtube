import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addExpandedID, removeExpandedID } from "./tempStateSlice";
import * as storageState from "../../lib/storage/tempState/tempState.ts"

const addIDMiddleware = createListenerMiddleware();
const removeIDMiddleware = createListenerMiddleware()

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

export default { addIDMiddleware, removeIDMiddleware };
