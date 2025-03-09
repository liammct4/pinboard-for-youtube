import { createContext } from "react";
import { getAlphanumericInsertIndex } from "../../../lib/util/generic/stringUtil";

export const DIRECTORY_NAME_MAX_LENGTH = 64;
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
	return getSectionPrefixManual(getSectionRaw(node), node.type);
}

export function getSectionPrefixManual(section: string, type: NodeType): string {
	return type == "VIDEO" ?
		`vd:${section}` :
		`dir:${section}`;
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


export type ValidateDirectoryNameError = 
	"TOO_LONG" |
	"EMPTY" |
	"INVALID_CHARACTERS" |
	"WHITESPACE_ONLY" |
	"STARTS_ENDS_IN_WHITESPACE";
	
/**
 * Rules:
 *  - Must have at least one character.
 *  - No greater than DIRECTORY_NAME_MAX_LENGTH (defined at the top of this file) characters.
 *  - Must only contain alphanumeric characters, { .,()[];@~-=+ } and spaces.
 *  - Cannot consist of whitespace characters only.
 *  - Cannot begin or end with a whitespace character (Strip if case).
 */
export function validateDirectoryName(directoryName: string): ValidateDirectoryNameError | null {
	let stripped = getRawSectionFromPrefix(directoryName);

	if (stripped.length < 1) {
		return "EMPTY";
	}
	else if (stripped.length > DIRECTORY_NAME_MAX_LENGTH) {
		return "TOO_LONG";
	}
	else if (/[^A-z\s.,()\[\]\;\@\~\-=\+]/.test(directoryName)) {
		return "INVALID_CHARACTERS";
	}
	else if (/^\s*$/.test(directoryName)) {
		return "WHITESPACE_ONLY";
	}
	else if (directoryName.trim().length == directoryName.length) {
		return "STARTS_ENDS_IN_WHITESPACE";
	}

	return null;
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

export function relocateItemToDirectory(root: IDirectoryNode, oldDirectory: string, newDirectory: string) {
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

	let directoryEndIndex = newParent.subNodes.findIndex(x => x.type == "VIDEO");

	if (item.type == "DIRECTORY") {
		
	}

	let insertIndex = getAlphanumericInsertIndex(newParent.subNodes, item, getSectionRaw, 0, directoryEndIndex);

	newParent.subNodes.splice(insertIndex, 0, item);
	
	item.parent = newParent;
}

export type AddDirectoryResult ="DOES_NOT_EXIST" | "NOT_A_DIRECTORY" | "DIRECTORY_ALREADY_EXISTS" | null;

export function addDirectory(root: IDirectoryNode, targetPath: string, name: string): AddDirectoryResult {
	let newParent = getItemFromNode(targetPath, root) as IDirectoryNode;

	if (newParent == undefined) {
		return "DOES_NOT_EXIST";
	}
	else if (newParent.type != "DIRECTORY") {
		return "NOT_A_DIRECTORY";
	}

	let existingIndex = newParent
		.subNodes
		.findIndex(x => getSectionPrefix(x) == getSectionPrefixManual(name, "DIRECTORY"));

	if (existingIndex != -1) {
		return "DIRECTORY_ALREADY_EXISTS";
	}

	let newDirectory: IDirectoryNode = {
		slice: name,
		parent: newParent,
		type: "DIRECTORY",
		subNodes: []
	};

	let videoStartIndex = newParent.subNodes.findIndex(x => x.type == "VIDEO");
	let insertIndex = getAlphanumericInsertIndex(newParent.subNodes, newDirectory, (item) => getSectionPrefix(item), 0, videoStartIndex);

	newParent.subNodes.splice(insertIndex, 0, newDirectory);

	return null;
}

export function findItemPathFromName(
		root: IDirectoryNode,
		itemName: string,
		includeDirectories: boolean,
		includeVideos: boolean,
		endAfterFirstMatch: boolean
	): string[] {
	let result: string[] = [];

	let itemNameDirectory = getSectionPrefixManual(itemName, "DIRECTORY");
	let itemNameVideo = getSectionPrefixManual(itemName, "VIDEO");

	const pass = (node: IDirectoryNode, accumulated: string) => {
		if (endAfterFirstMatch && result.length > 0) {
			return;
		}

		accumulated = accumulated == "" ? getSectionRaw(node) : directoryPathConcat(accumulated, getSectionRaw(node));

		for (let subNode of node.subNodes) {
			let sectionPrefix = getSectionPrefix(subNode);

			if (subNode.type == "DIRECTORY") {
				if (includeDirectories && sectionPrefix == itemNameDirectory) {
					result.push(directoryPathConcat(accumulated, getSectionRaw(subNode)));
				}

				pass(subNode as IDirectoryNode, accumulated);
			}
			else if (subNode.type == "VIDEO") {
				if (!includeVideos) {
					break;
				}

				if (sectionPrefix == itemNameVideo) {
					result.push(accumulated);
				}
			}
		}
	};

	pass(root, "");

	return result;
}

export function removeItems(root: IDirectoryNode, basePath: string, targetSections: string[]) {
	let baseNode = getItemFromNode(basePath, root) as IDirectoryNode;

	if (baseNode == undefined || baseNode.type != "DIRECTORY") {
		return;
	}

	for (let target of targetSections) {
		let targetIndex = baseNode.subNodes.findIndex(x => getSectionPrefix(x) == target);

		if (targetIndex == -1) {
			continue;
		}

		baseNode.subNodes.splice(targetIndex, 1);
	}
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
