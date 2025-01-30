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
	const slices = splitPathIntoSlices(path);

	let current: IVideoBrowserNode = node;

	if (node.slice.trim() == slices[0].trim()) {
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
			let nodeSliceOrID = getSectionRaw(node);
			
			if (slice.trim() == nodeSliceOrID.trim()) {
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

// A section is either a slice, or a video ID.

export function getSectionRaw(node: IVideoBrowserNode): string {
	if (node.type == "VIDEO") {
		return (node as IVideoNode).videoID;
	}
	else {
		return (node as IDirectoryNode).slice;
	}
}

export function getSectionPrefix(node: IVideoBrowserNode): string {
	if (node.type == "VIDEO") {
		return `vd:${(node as IVideoNode).videoID}`;
	}
	else {
		return `dir:${(node as IDirectoryNode).slice}`;
	}
}

export function getSectionType(section: string): NodeType {
	if (section.startsWith("vd:")) {
		return "VIDEO";
	}
	else {
		return "DIRECTORY";
	}
}

export function getRawSectionFromPrefix(section: string): string {
	if (section.startsWith("vd:")) {
		return section.substring(3, section.length);
	}
	else if (section.startsWith("dir:")) {
		return section.substring(4, section.length);
	}
	else {
		return section;
	}
}

export function splitPathIntoSlices(path: string): string[] {
	return path.split('>').map(x => x.trim());
}

export function getParentPathFromPath(path: string): string {
	let slices = splitPathIntoSlices(path);

	slices.splice(slices.length - 1, 1);

	return slices.join(" > ");
}

export function reformatDirectoryPath(path: string): string {
	const slices = splitPathIntoSlices(path);

	return slices.join(" > ");
}

export function directoryPathConcat(base: string, slice: string): string {
	let slim = base.trim();

	if (slim.endsWith(">", )) {
		slim = slim.slice(0, slim.length - 2);
	}

	slim = slim.trimEnd();

	return slim + " > " + slice.trim();
}

export function getRootDirectoryPathFromSubDirectory(directory: IVideoBrowserNode): string {
	let slices: string[] = [ getSectionRaw(directory) ];
	let current = directory.parent;

	while (current != null) {
		slices.unshift(current.slice);

		current = current.parent;
	}

	let fullPath = slices.join(" > ");

	return fullPath;
}

export function relocateDirectory(root: IDirectoryNode, oldDirectory: string, newDirectory: string) {
	let oldSplit = splitPathIntoSlices(oldDirectory);
	let newSplit = splitPathIntoSlices(newDirectory);

	// Incase of just renaming the directory. No need to traverse.
	if (oldSplit.length == newSplit.length) {
		let equal = true;

		for (let i = 0; i < newSplit.length - 1; i++) {
			if (oldSplit[i] == newSplit[i]) {
				continue;
			}

			equal = false;
			break;
		}

		// The first part of the path is equal, just the end might not be. (Renaming).
		if (equal) {
			let item = getItemFromNode(oldDirectory, root) as IDirectoryNode;

			item.slice = newSplit[newSplit.length - 1];
			return;
		}
	}

	// Otherwise, move as normal.
	// Remove from old location.
	let item = getItemFromNode(oldDirectory, root) as IDirectoryNode;

	let oldParentIndex = item?.parent?.subNodes.findIndex(x => (x as IDirectoryNode).slice == item.slice) as number;
	item.parent?.subNodes.splice(oldParentIndex, 1);

	// Place in new location.
	let newParentPath = [ ...newSplit ];
	newParentPath.splice(newSplit.length - 1, 1);

	let newParent = getItemFromNode(newParentPath.join(" > "), root) as IDirectoryNode;

	newParent.subNodes.push(item);
	item.parent = newParent;
}

export interface IVideoDirectoryInteractionContext {
	navigateRequest: (requester: IDirectoryNode) => void;
	selectedItems: string[];
	setSelectedItems: (selectedItems: string[]) => void;
	currentlyEditing: string | null;
	requestEditEnd: (newSliceName: string) => void;
	draggingID: string | null;
}

export const VideoDirectoryInteractionContext = createContext<IVideoDirectoryInteractionContext>(
	{
		navigateRequest: () => console.error("Cannot navigate VideoDirectory due to no context provided."),
		selectedItems: [],
		setSelectedItems: () => console.error("No context provided: VideoDirectoryInteractionContext.setSelectedItems"),
		currentlyEditing: null,
		requestEditEnd:  () => console.error("No context provided: VideoDirectoryInteractionContext.requestEditEnd"),
		draggingID: null,
	}
);
