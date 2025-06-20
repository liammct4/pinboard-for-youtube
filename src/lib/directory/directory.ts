import { getAlphanumericInsertIndex } from "../util/generic/stringUtil";
import { GUID } from "../util/objects/types";
import { IYoutubeVideoInfo } from "../util/youtube/youtubeUtil";
import { directoryPathConcat, NodePath, parsePath } from "./path";

export const DIRECTORY_NAME_MAX_LENGTH = 64;
export type NodeType = "VIDEO" | "DIRECTORY";

export type NodeRef = `${GUID}:NODE`;

export interface INode {
	/* parent: NodeRef | null;*/ // Maybe?
	nodeID: NodeRef;
}

export interface IVideoNode extends INode {
	videoID: string;
}

export interface IDirectoryNode extends INode {
	slice: string;
	subNodes: NodeRef[];
}

export type DirectoryTree = {
	rootNode: NodeRef;
	directoryNodes: {
		[key: NodeRef]: IDirectoryNode;
	},
	videoNodes: {
		[key: NodeRef]: IVideoNode;
	}
}

/**
 * Creates a unique unchangable ID exclusively used for nodes.
 */
export function createNode(): NodeRef {
	return `${crypto.randomUUID()}:NODE`;
}

export function getNodeFromRef(tree: DirectoryTree, ref: NodeRef) {
	if (tree.directoryNodes[ref] != null) {
		return tree.directoryNodes[ref];
	}

	return tree.videoNodes[ref];
}

export function getNodeSection(tree: DirectoryTree, node: INode) {
	if (getNodeType(tree, node.nodeID) == "DIRECTORY") {
		return (node as IDirectoryNode).slice;
	}

	return (node as IVideoNode).videoID;
}

/**
 * Retrieves the node ID of the node referenced at the provided path.
 */
export function getNodeFromPath(tree: DirectoryTree, path: NodePath): NodeRef | null {	
	let currentNode: NodeRef = tree.rootNode;

	if (path.slices[0] != tree.directoryNodes[tree.rootNode].slice) {
		return null;
	}

	for (let i = 1; i < path.slices.length; i++) {
		let nodeData: IDirectoryNode = tree.directoryNodes[currentNode];
		
		// The item should be in the current node.
		if (i == path.slices.length - 1 && path.type == "VIDEO") {
			for (let j = nodeData.subNodes.length - 1; j > -1; j--) {
				let subNode: NodeRef = nodeData.subNodes[j];
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

export function getNodeFromVideoID(tree: DirectoryTree, id: string): NodeRef | null {
	for (let node of Object.values(tree.videoNodes)) {
		if (node.videoID == id) {
			return node.nodeID;
		}
	}

	return null;
}

/**
 * Returns the type of node which is referenced by the provided node ID.
 */
export function getNodeType(tree: DirectoryTree, node: NodeRef): NodeType {
	return tree.directoryNodes[node] != null ? "DIRECTORY" : "VIDEO";
}

/**
 * Retrieves the full path of an item from its node ID.
 */
export function getPathOfNode(tree: DirectoryTree, targetNode: NodeRef): NodePath | null {
	if (targetNode == tree.rootNode) {
		return parsePath("$");
	}

	const pass = (current: NodePath, node: NodeRef): NodePath | null => {
		let data = tree.directoryNodes[node] as IDirectoryNode;

		for (let i of data.subNodes) {
			if (i == targetNode) {
				if (getNodeType(tree, targetNode) == "DIRECTORY") {
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

	return pass(parsePath("$"), tree.rootNode);
}

export function removeSubBranches(tree: DirectoryTree, nodeID: NodeRef) {
	let nodes = traverseTreeDF(tree, nodeID);

	if (nodes == null) {
		return;
	}

	for (let node of nodes) {
		if (getNodeType(tree, node) == "DIRECTORY") {
			delete tree.directoryNodes[node];
		}
		else {
			delete tree.videoNodes[node];
		}
	}
}

export function traverseTreeDF(tree: DirectoryTree, topNodeID: NodeRef): NodeRef[] | null {
	let topNode = tree.directoryNodes[topNodeID];

	if (topNode == null) {
		return null;
	}

	let traversal: NodeRef[] = [];

	const pass = (nodeID: NodeRef) => {
		let node = tree.directoryNodes[nodeID];
		
		if (node == null) {
			return;
		}

		for (let subNode of node.subNodes) {
			traversal.push(subNode);

			if (tree.directoryNodes[subNode] != null) {
				pass(subNode);
			}
		}
	}

	pass(topNodeID);

	return traversal;
}

export function insertNodeInOrder(tree: DirectoryTree, parent: NodeRef, newNodeRef: NodeRef, videoInfo: IYoutubeVideoInfo[]) {
	let parentNode: IDirectoryNode = tree.directoryNodes[parent];

	let insertIndex;

	if (getNodeType(tree, newNodeRef) == "DIRECTORY") {
		let directoryStartIndex = parentNode.subNodes.findIndex(x => tree.videoNodes[x] != null);

		if (directoryStartIndex == -1) {
			directoryStartIndex = parentNode.subNodes.length;
		}

		let newNode = tree.directoryNodes[newNodeRef] as IDirectoryNode;

		insertIndex = getAlphanumericInsertIndex(
			parentNode.subNodes,
			newNodeRef,
			(nID: NodeRef) => nID == newNode.nodeID ? newNode.slice : tree.directoryNodes[nID].slice,
			0,
			directoryStartIndex
		);
	}
	else {
		let newNode: IVideoNode = tree.videoNodes[newNodeRef];

		const accessor = (nodeID: NodeRef): string => {
			if (nodeID == newNodeRef) {
				return videoInfo.find(x => x.video_id == newNode.videoID)?.title ?? newNode.videoID;
			}

			let nodeData = tree.videoNodes[nodeID];

			if (nodeData == null) {
				return "";
			}

			return videoInfo.find(x => x.video_id == nodeData.videoID)?.title ?? nodeData.videoID;
		}

		let directoryStartIndex = parentNode.subNodes.findIndex(x => tree.videoNodes[x] != null);

		if (directoryStartIndex == -1) {
			directoryStartIndex = parentNode.subNodes.length;
		}

		insertIndex = getAlphanumericInsertIndex(
			parentNode.subNodes,
			newNode.nodeID,
			accessor,
			directoryStartIndex,
			parentNode.subNodes.length
		);
	}

	parentNode.subNodes.splice(insertIndex, 0, newNodeRef);
}

export function stringifyNode(tree: DirectoryTree, node: NodeRef, withGuidelines: boolean): string {
	let lines: string[] = [
		`D:${tree.directoryNodes[node].slice}`
	];
	
	const pass = (node: NodeRef, indent: number) => {
		let nodeData = tree.directoryNodes[node];

		for (let i = 0; i < nodeData.subNodes.length; i++) {
			let node = nodeData.subNodes[i];

			let indentTabs: string;

			if (withGuidelines) {
				let character = i == nodeData.subNodes.length - 1 ? '├' : '├';
				indentTabs = `│   `.repeat(indent - 1) + `${character}── `;
			}
			else {
				indentTabs = `    `.repeat(indent);
			}
			
			if (getNodeType(tree, node) == "DIRECTORY") {
				let line = indentTabs + `D:${tree.directoryNodes[node].slice}`;
				lines.push(line);

				pass(node, indent + 1);
			}
			else {
				let line = indentTabs + `V:${tree.videoNodes[node].videoID}`;
				lines.push(line);
			}
		}
	}

	pass(node, 1);

	return lines.join("\n");
}

export function stringifyTree(tree: DirectoryTree, withGuidelines: boolean): string {
	return stringifyNode(tree, tree.rootNode, withGuidelines);
}
