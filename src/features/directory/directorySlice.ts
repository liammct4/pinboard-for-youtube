import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IStorage } from "../../lib/storage/storage";
import { DirectoryTree, getItemFromPath, IVideoNode } from "../../lib/directory/directory";
import { parseStringToPath } from "../../lib/directory/path";
import { getAlphanumericInsertIndex } from "../../lib/util/generic/stringUtil";
import { GUID } from "../../lib/util/objects/types";
import { IYoutubeVideoInfo } from "../../lib/util/youtube/youtubeUtil";

export interface IDirectorySlice {
	videoBrowser: DirectoryTree;
}

let rootNodeID = crypto.randomUUID();

const initialState: IDirectorySlice = {
	videoBrowser: {
		rootNode: rootNodeID,
		directoryNodes: {},
		videoNodes: {}
	}
}

initialState.videoBrowser.directoryNodes[rootNodeID] = {
	nodeID: rootNodeID,
	slice: "$",
	subNodes: []
}

type DirectoryAddVideoPayload = {
	path: string;
	videoID: string;
	videoData: IYoutubeVideoInfo[];
}

export const directorySlice = createSlice({
	name: "directory",
	initialState,
	reducers: {
		updateDirectorySliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.videoBrowser = action.payload.userData.directory;
		},
		directoryAddVideo: (state, action: PayloadAction<DirectoryAddVideoPayload>) => {
			let path = parseStringToPath(action.payload.path);

			if (path.type != "DIRECTORY") {
				console.error(`directoryAddVideo: Provided path was not a directory path: "${action.payload}".`);
				return;
			}
			
			let targetDirectoryID = getItemFromPath(state.videoBrowser, path);

			if (targetDirectoryID == null) {
				console.error("directoryAddVideo: targetDirectoryID is null.");
				return;
			}

			let targetDirectory = state.videoBrowser.directoryNodes[targetDirectoryID];

			let directoryStartIndex = targetDirectory.subNodes.findIndex(x => state.videoBrowser.videoNodes[x] != null);

			if (directoryStartIndex == -1) {
				directoryStartIndex = targetDirectory.subNodes.length;
			}

			// Get index of where the new node should be.
			let newNode: IVideoNode = {
				nodeID: crypto.randomUUID(),
				videoID: action.payload.videoID
			};

			const accessor = (nodeID: GUID): string => {
				if (nodeID == newNode.nodeID) {
					return action.payload.videoData.find(x => x.video_id == action.payload.videoID)?.title ?? action.payload.videoID;
				}

				let nodeData = state.videoBrowser.videoNodes[nodeID];

				if (nodeData == null) {
					return "";
				}

				return action.payload.videoData.find(x => x.video_id == nodeData.videoID)?.title ?? nodeData.videoID;
			}

			let insertIndex = getAlphanumericInsertIndex(
				targetDirectory.subNodes,
				newNode.nodeID,
				accessor,
				directoryStartIndex,
				targetDirectory.subNodes.length
			);

			targetDirectory.subNodes.splice(insertIndex, 0, newNode.nodeID);
			state.videoBrowser.videoNodes[newNode.nodeID] = newNode;
		},
	}
});

export const {
	updateDirectorySliceFromStorage,
	directoryAddVideo
} = directorySlice.actions;
export default directorySlice.reducer;
