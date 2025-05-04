import { GUID } from "../util/objects/types";
import { directoryPathConcat, NodePath, parsePathFromString } from "./path";

export const DIRECTORY_NAME_MAX_LENGTH = 64;
export type NodeType = "VIDEO" | "DIRECTORY";

export interface INode {
	/* parent: GUID | null;*/ // Maybe?
	nodeID: GUID;
}

export interface IVideoNode extends INode {
	videoID: string;
}

export interface IDirectoryNode extends INode {
	slice: string;
	subNodes: GUID[];
}

export type DirectoryTree = {
	rootNode: GUID;
	directoryNodes: {
		[key: GUID]: IDirectoryNode;
	},
	videoNodes: {
		[key: GUID]: IVideoNode;
	}
}

export function getItemFromPath(tree: DirectoryTree, path: NodePath): GUID | null {	
	let currentNode: GUID = tree.rootNode;

	if (path.slices[0] != tree.directoryNodes[tree.rootNode].slice) {
		return null;
	}

	for (let i = 1; i < path.slices.length; i++) {
		let nodeData: IDirectoryNode = tree.directoryNodes[currentNode];
		
		// The item should be in the current node.
		if (i == path.slices.length - 1 && path.type == "VIDEO") {
			for (let j = nodeData.subNodes.length - 1; j > -1; j--) {
				let subNode: GUID = nodeData.subNodes[j];
				let videoNode: IVideoNode = tree.videoNodes[subNode];

				if (videoNode != null && videoNode.videoID == path.slices[i]) {
					return subNode;
				}
			}

			return null;
		}

		let progressed = false;

		for (let subNode of nodeData.subNodes) {
			let subNodeData = tree.directoryNodes[subNode];
			
			if (subNodeData != undefined && subNodeData.slice == path.slices[i]) {
				currentNode = subNode;
				
				if (i == path.slices.length - 1) {
					return currentNode;
				}
				
				progressed = true;
				continue;
			}
		}
		
		// Specified directory does not exist.
		if (!progressed) {
			return null;
		}
	}

	return currentNode;
}

export function getNodeType(tree: DirectoryTree, node: GUID): NodeType {
	return tree.directoryNodes[node] != null ? "DIRECTORY" : "VIDEO";
}

export function getPathOfItem(tree: DirectoryTree, targetItem: GUID): NodePath | null {
	if (targetItem == tree.rootNode) {
		return parsePathFromString("$");
	}

	const pass = (current: NodePath, item: GUID): NodePath | null => {
		let data = tree.directoryNodes[item] as IDirectoryNode;

		for (let i of data.subNodes) {
			if (i == targetItem) {
				if (getNodeType(tree, targetItem) == "DIRECTORY") {
					return directoryPathConcat(current, tree.directoryNodes[i].slice, "DIRECTORY");
				}
				else {
					return directoryPathConcat(current, tree.videoNodes[i].videoID, "VIDEO");
				}
			}

			let subNodeData = tree.directoryNodes[i];
			
			if (subNodeData != null) {
				let result = pass(directoryPathConcat(current, subNodeData.slice, "DIRECTORY"), i);

				if (result != null) {
					return result;
				}
			}
		}

		return null;
	}

	return pass(parsePathFromString("$"), tree.rootNode);
}
