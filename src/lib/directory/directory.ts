import { GUID } from "../util/objects/types";
import { NodePath } from "./path";

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
