import { createListenerMiddleware } from "@reduxjs/toolkit";
import { DataMutation } from "../../components/features/useUserAccount";
import { RootState } from "../../app/store";
import { directoryActions, optionalStringPath } from "./directorySlice";
import { mutationActions } from "../mutation/mutationSlice";
import { getNodeFromPath } from "../../lib/directory/directory";
import { directoryPathConcat, pathToString } from "../../lib/directory/path";
import { IDirectoryModificationAction } from "../../lib/user/resources/directory";

export const addVideoMiddleware = createListenerMiddleware();

addVideoMiddleware.startListening({
	actionCreator: directoryActions.createVideoNode,
	effect: (action, listenerApi) => {
		let state = listenerApi.getState() as RootState;
		let parentPath = optionalStringPath(action.payload.parentPath);
		let parent = getNodeFromPath(state.directory.videoBrowser, parentPath);

		if (parentPath.type != "DIRECTORY" || parent == null) {
			return;
		}

		let item = getNodeFromPath(state.directory.videoBrowser, directoryPathConcat(parentPath, action.payload.videoID, "VIDEO"));

		// Means it was not created successfully.
		if (item == null) {
			return;
		}

		let mutation: DataMutation<IDirectoryModificationAction> = {
			dataID: item,
			timestamp: Date.now(),
			position: state.directory.videoBrowser.directoryNodes[parent].subNodes.findIndex(x => x == item),
			data: {
				action: "Create",
				path: pathToString(parentPath),
				data: action.payload.videoID,
				type: "Video"
			}
		}

		listenerApi.dispatch(mutationActions.appendRequestToDirectory(mutation));
	}
});
