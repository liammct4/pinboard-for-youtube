import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IStorage } from "../../lib/storage/storage";
import { createNode, DirectoryTree, getNodeFromPath, getPathOfNode, IDirectoryNode, IVideoNode, NodeRef } from "../../lib/directory/directory";
import { getParentPathFromPath, NodePath, parsePath, validateDirectoryName } from "../../lib/directory/path";
import { getAlphanumericInsertIndex } from "../../lib/util/generic/stringUtil";
import { IYoutubeVideoInfo } from "../../lib/util/youtube/youtubeUtil";

export interface IDirectorySlice {
	videoBrowser: DirectoryTree;
}

let rootNodeID = createNode();

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

type DirectoryAddDirectoryPayload = {
	path: string;
	slice: string;
}

export const directorySlice = createSlice({
	name: "directory",
	initialState,
	reducers: {
		updateDirectorySliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.videoBrowser = action.payload.userData.directory;
		},
		createDirectoryNode: (state, action: PayloadAction<DirectoryAddDirectoryPayload>) => {
			let parentPath = parsePath(action.payload.path);

			let validate = validateDirectoryName(action.payload.slice.trim());

			if (validate != null && validate != "STARTS_ENDS_IN_WHITESPACE") {
				console.error(`directory.createDirectoryNode: Provided slice was invalid (${validate}).:"${action.payload.slice}".`);
			}

			if (parentPath.type != "DIRECTORY") {
				console.error(`directory.createDirectoryNode: Provided parent path was a video path. "${action.payload.path}".`)
				return;
			}

			let parentNodeID = getNodeFromPath(state.videoBrowser, parentPath);

			if (parentNodeID == null) {
				console.error(`directory.createDirectoryNode: Provided parent path does not exist in the tree. "${action.payload.path}".`);
				return;
			}

			let parentNode = state.videoBrowser.directoryNodes[parentNodeID];
			let newNode: IDirectoryNode = {
				nodeID: createNode(),
				slice: action.payload.slice,
				subNodes: []
			};

			let directoryStartIndex = parentNode.subNodes.findIndex(x => state.videoBrowser.videoNodes[x] != null);

			if (directoryStartIndex == -1) {
				directoryStartIndex = parentNode.subNodes.length;
			}

			let insertIndex = getAlphanumericInsertIndex(
				parentNode.subNodes,
				newNode.nodeID,
				(nID: NodeRef) => nID == newNode.nodeID ? action.payload.slice : state.videoBrowser.directoryNodes[nID].slice,
				0,
				directoryStartIndex
			);

			parentNode.subNodes.splice(insertIndex, 0, newNode.nodeID);
			state.videoBrowser.directoryNodes[newNode.nodeID] = newNode;
		},
		createVideoNode: (state, action: PayloadAction<DirectoryAddVideoPayload>) => {
			let path = parsePath(action.payload.path);

			if (path.type != "DIRECTORY") {
				console.error(`directory.createVideoNode: Provided path was not a directory path: "${action.payload}".`);
				return;
			}
			
			let targetDirectoryID = getNodeFromPath(state.videoBrowser, path);

			if (targetDirectoryID == null) {
				console.error("directory.createVideoNode: targetDirectoryID is null.");
				return;
			}

			let targetDirectory = state.videoBrowser.directoryNodes[targetDirectoryID];

			let directoryStartIndex = targetDirectory.subNodes.findIndex(x => state.videoBrowser.videoNodes[x] != null);

			if (directoryStartIndex == -1) {
				directoryStartIndex = targetDirectory.subNodes.length;
			}

			// Get index of where the new node should be.
			let newNode: IVideoNode = {
				nodeID: createNode(),
				videoID: action.payload.videoID
			};

			const accessor = (nodeID: NodeRef): string => {
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
		removeVideoNodes: (state, action: PayloadAction<string[]>) => {
			let videoNodes = Object.values(state.videoBrowser.videoNodes);

			for (let video of action.payload) {
				let nodeID = videoNodes.find(x => x.videoID == video)?.nodeID;
	
				if (nodeID == null) {
					console.error(`directory.removeVideoNodes: provided nodeID for video to remove was null: "${action.payload}"`);
					continue;
				}

				let parentPath = getParentPathFromPath(getPathOfNode(state.videoBrowser, nodeID) as NodePath);
				let parentNodeID = getNodeFromPath(state.videoBrowser, parentPath) as NodeRef;
				let parentNode = state.videoBrowser.directoryNodes[parentNodeID] as IDirectoryNode;
				
				let targetIndex = parentNode.subNodes.findIndex(x => x == nodeID);

				parentNode.subNodes.splice(targetIndex, 1);
				delete state.videoBrowser.directoryNodes[nodeID];
			}
		}
	}
});

export const {
	updateDirectorySliceFromStorage,
	createVideoNode,
	createDirectoryNode,
	removeVideoNodes
} = directorySlice.actions;
export default directorySlice.reducer;
