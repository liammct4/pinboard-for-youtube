import { IDirectoryNode, IVideoNode, VideoBrowserNode } from "../../directory/directory";

export function addParentPass(root: IDirectoryNode) {
	for (let node of (root as IDirectoryNode).subNodes) {
		node.parent = root;

		if (node.type == "DIRECTORY") {
			addParentPass(node as IDirectoryNode);
		}
	}
}

export function removeParentPass(root: IDirectoryNode): IDirectoryNode {
	let newRoot: IDirectoryNode = {
		nodeID: root.nodeID,
		slice: root.slice,
		parent: null,
		subNodes: [],
		type: "DIRECTORY"
	}

	for (let node of root.subNodes) {
		let newNode: VideoBrowserNode;

		if (node.type == "DIRECTORY") {
			newNode = removeParentPass(node);
		}
		else {
			let newVideoNode: IVideoNode = {
				nodeID: node.nodeID,
				parent: null,
				type: "VIDEO",
				videoID: node.videoID
			};

			newNode = newVideoNode;
		}

		newRoot.subNodes.push(newNode);
	}

	return newRoot;
}
