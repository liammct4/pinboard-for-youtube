import { createListenerMiddleware } from "@reduxjs/toolkit";
import { DataMutation } from "../../components/features/useUserAccount";
import { RootState } from "../../app/store";
import { IDirectoryModificationAction } from "../../components/features/resources/useDirectoryResource";
import { directoryAddVideo } from "./directorySlice";
import { appendRequestToDirectory } from "../mutation/mutationSlice";
import { getNodeFromPath } from "../../lib/directory/directory";
import { directoryPathConcat, getParentPathFromPath, NodePath, parsePath, pathToString } from "../../lib/directory/path";

export const addVideoMiddleware = createListenerMiddleware();

addVideoMiddleware.startListening({
	actionCreator: directoryAddVideo,
	effect: (action, listenerApi) => {
		let state = listenerApi.getState() as RootState;
		let parentPath = parsePath(action.payload.path);
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

		listenerApi.dispatch(appendRequestToDirectory(mutation));
	}
});
