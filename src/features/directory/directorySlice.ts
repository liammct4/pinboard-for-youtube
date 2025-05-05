import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IStorage } from "../../lib/storage/storage";
import { createNode, DirectoryTree, getNodeFromPath, getNodeType, getPathOfNode, IDirectoryNode, insertNodeInOrder, IVideoNode, NodeRef, removeSubBranches } from "../../lib/directory/directory";
import { getParentPathFromPath, NodePath, parsePath, pathEquals, pathToString, validateDirectoryName } from "../../lib/directory/path";
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
	parentPath: NodePath | string;
	videoID: string;
	videoData: IYoutubeVideoInfo[];
}

type DirectoryAddDirectoryPayload = {
	parentPath: NodePath | string;
	slice: string;
}

type DirectoryMoveNodePayload = {
	targetPath: NodePath | string;
	destinationPath: NodePath | string;
	videoData: IYoutubeVideoInfo[];
}

type DirectoryRenameDirectoryPayload = {
	targetPath: NodePath;
	newSlice: string;
}

export function optionalStringPath(path: NodePath | string): NodePath {
	return path instanceof String ? parsePath(path as string) : path as NodePath;
}

export const directorySlice = createSlice({
	name: "directory",
	initialState,
	reducers: {
		updateDirectorySliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.videoBrowser = action.payload.userData.directory;
		},
		renameDirectory: (_state, _action: PayloadAction<DirectoryRenameDirectoryPayload>) => {
			// TODO.
		},
		moveNode: (state, action: PayloadAction<DirectoryMoveNodePayload>) => {
			let targetPath = optionalStringPath(action.payload.targetPath);
			let destinationPath = optionalStringPath(action.payload.destinationPath);

			let targetParentPath = getParentPathFromPath(targetPath);

			if (destinationPath.type == "VIDEO") {
				console.error(`directory.moveNode: New location path was a video path: "${pathToString(destinationPath)}"`);
				return;
			}

			if (pathEquals(targetParentPath, destinationPath)) {
				console.error("directory.moveNode: Target is already in the same directory.");
			}

			let currentID = getNodeFromPath(state.videoBrowser, targetPath) as NodeRef;
			let currentParent = state.videoBrowser.directoryNodes[getNodeFromPath(state.videoBrowser, targetParentPath) as NodeRef];
			
			let currentIndex = currentParent.subNodes.findIndex(x => x == currentID);
			currentParent.subNodes.splice(currentIndex, 1);

			let destinationID = getNodeFromPath(state.videoBrowser, destinationPath) as NodeRef;

			insertNodeInOrder(state.videoBrowser, destinationID, currentID, action.payload.videoData);
		},
		createDirectoryNode: (state, action: PayloadAction<DirectoryAddDirectoryPayload>) => {
			let parentPath = optionalStringPath(action.payload.parentPath);

			let validate = validateDirectoryName(action.payload.slice.trim());

			if (validate != null && validate != "STARTS_ENDS_IN_WHITESPACE") {
				console.error(`directory.createDirectoryNode: Provided slice was invalid (${validate}).:"${action.payload.slice}".`);
			}

			if (parentPath.type != "DIRECTORY") {
				console.error(`directory.createDirectoryNode: Provided parent path was a video path. "${pathToString(parentPath)}".`)
				return;
			}

			let parentNodeID = getNodeFromPath(state.videoBrowser, parentPath);

			if (parentNodeID == null) {
				console.error(`directory.createDirectoryNode: Provided parent path does not exist in the tree. "${pathToString(parentPath)}".`);
				return;
			}

			let newNode: IDirectoryNode = {
				nodeID: createNode(),
				slice: action.payload.slice,
				subNodes: []
			};

			state.videoBrowser.directoryNodes[newNode.nodeID] = newNode;
			insertNodeInOrder(state.videoBrowser, parentNodeID, newNode.nodeID, []);
		},
		createVideoNode: (state, action: PayloadAction<DirectoryAddVideoPayload>) => {
			let path = optionalStringPath(action.payload.parentPath);

			if (path.type != "DIRECTORY") {
				console.error(`directory.createVideoNode: Provided path was not a directory path: "${action.payload}".`);
				return;
			}
			
			let targetDirectoryID = getNodeFromPath(state.videoBrowser, path);

			if (targetDirectoryID == null) {
				console.error("directory.createVideoNode: targetDirectoryID is null.");
				return;
			}

			// Get index of where the new node should be.
			let newNode: IVideoNode = {
				nodeID: createNode(),
				videoID: action.payload.videoID
			};

			state.videoBrowser.videoNodes[newNode.nodeID] = newNode;
			insertNodeInOrder(state.videoBrowser, targetDirectoryID, newNode.nodeID, action.payload.videoData);
		},
		removeNodes: (state, action: PayloadAction<string[]>) => {
			for (let pathString of action.payload) {
				let path = parsePath(pathString);
				let nodeID = getNodeFromPath(state.videoBrowser, path) as NodeRef;

				if (nodeID == state.videoBrowser.rootNode) {
					let nodeData = state.videoBrowser.directoryNodes[nodeID];
					
					nodeData.subNodes = [];
					state.videoBrowser.directoryNodes = {};
					state.videoBrowser.videoNodes = {};

					// No point in doing anything else.
					return;
				}

				if (nodeID == null) {
					continue;
				}

				let parentPath = getParentPathFromPath(path);

				let parentID = getNodeFromPath(state.videoBrowser, parentPath) as NodeRef;
				let parentNode = state.videoBrowser.directoryNodes[parentID];

				let index = parentNode.subNodes.findIndex(x => x == nodeID);
				
				parentNode.subNodes.splice(index, 1);
				
				if (getNodeType(state.videoBrowser, nodeID) == "DIRECTORY") {
					removeSubBranches(state.videoBrowser, nodeID);
					delete state.videoBrowser.directoryNodes[nodeID];
				}
				else {
					delete state.videoBrowser.videoNodes[nodeID];
				}
			}
		},
		removeVideoNodesByID: (state, action: PayloadAction<string[]>) => {
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

export const directoryActions = directorySlice.actions;

