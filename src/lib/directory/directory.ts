import { GUID } from "../util/objects/types";
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
				indentTabs = `│\t`.repeat(indent - 1) + `${character}── `;
			}
			else {
				indentTabs = `\t`.repeat(indent);
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
