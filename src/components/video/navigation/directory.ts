import { createContext } from "react";

export type NodeType = "VIDEO" | "DIRECTORY";

export interface IVideoBrowserNode {
	type: NodeType;
	parent: IDirectoryNode | null;
}

export interface IVideoNode extends IVideoBrowserNode {
	videoID: string;
}

export interface IDirectoryNode extends IVideoBrowserNode {
	slice: string;
	subNodes: IVideoBrowserNode[];
}

export function getItemFromNode(path: string, node: IDirectoryNode): IVideoBrowserNode | null {
	const slices = path.split('>');

	let current: IVideoBrowserNode = node;

	if (node.slice == slices[0]) {
		slices.splice(0, 1);
	}
	else {
		return null;
	}

	for (let slice of slices) {
		let found = false;

		if (current.type == "VIDEO") {
			// Means that there was an attempt to get a video from a sub video. e.g. /dirA/dirB/dirC/vidA/vidB, which isn't valid.
			return null;
		}

		let currentDirectory = current as IDirectoryNode;

		for (let node of currentDirectory.subNodes) {
			let nodeSliceOrID = getNodePathIdentifier(node);
			
			if (slice == nodeSliceOrID) {
				current = node;
				found = true;
				break;
			}
		}

		if (!found) {
			return null;
		}
	}

	return current;
}

export function getNodePathIdentifier(node: IVideoBrowserNode): string {
	if (node.type == "VIDEO") {
		return (node as IVideoNode).videoID;
	}
	else {
		return (node as IDirectoryNode).slice;
	}
}

export function getRootDirectoryPathFromSubDirectory(directory: IVideoBrowserNode): string {
	let slices: string[] = [ getNodePathIdentifier(directory) ];
	let current = directory.parent;

	while (current != null) {
		slices.unshift(current.slice);

		current = current.parent;
	}

	let fullPath = slices.join(">");

	return fullPath;
}

export interface IVideoDirectoryInteractionContext {
	navigateRequest: (requester: IDirectoryNode) => void;
}

export const VideoDirectoryInteractionContext = createContext<IVideoDirectoryInteractionContext>(
	{
		navigateRequest: () => console.error("Cannot navigate VideoDirectory due to no context provided.")
	}
);
