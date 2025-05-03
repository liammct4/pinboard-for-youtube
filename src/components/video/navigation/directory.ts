import { createContext } from "react";
import { getAlphanumericInsertIndex } from "../../../lib/util/generic/stringUtil";
import { accessStorage } from "../../../lib/storage/storage";
import { GUID } from "../../../lib/util/objects/types";

export const DIRECTORY_NAME_MAX_LENGTH = 64;
export type NodeType = "VIDEO" | "DIRECTORY";

export type NodePath = {
	slices: string[],
	type: NodeType;
}

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

export function getItemFromPath(tree: DirectoryTree, path: string): GUID | null {
	const pathSlices = splitPathIntoSlices(path);
	
	let currentNode: GUID = tree.rootNode;

	if (pathSlices.slices[0] != tree.directoryNodes[tree.rootNode].slice) {
		return null;
	}

	for (let i = 1; i < pathSlices.slices.length; i++) {
		let nodeData: IDirectoryNode = tree.directoryNodes[currentNode];
		
		// The item should be in the current node.
		if (i == pathSlices.slices.length - 1 && pathSlices.type == "VIDEO") {
			for (let j = nodeData.subNodes.length - 1; j > -1; j--) {
				let subNode: GUID = nodeData.subNodes[j];
				let videoNode: IVideoNode = tree.videoNodes[subNode];

				if (videoNode.videoID == pathSlices.slices[i]) {
					return subNode;
				}
			}

			return null;
		}

		let progressed = false;

		for (let subNode of nodeData.subNodes) {
			let subNodeData = tree.directoryNodes[subNode];
			
			if (subNodeData != undefined && subNodeData.slice == pathSlices.slices[i]) {
				currentNode = subNode;
				
				if (i == pathSlices.slices.length - 1) {
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
	else if (/[^A-z0-9\s.,()\/\[\]\;\@\~\-=\+]/.test(directoryName)) {
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

/**
 * Splits a provided path into their individual sections.
 * 
 * Returns whether the last item
 * is a video ID or not. In the format "$ > Random > Other:LXb3EKWsInQ".
 */
export function splitPathIntoSlices(path: string): NodePath {
	let sections = path.split(">").map(x => x.trim());

	let potentialVideoReference: string[] = sections[sections.length - 1].split(":");

	if (potentialVideoReference.length == 2)
	{
		sections.splice(sections.length - 1, 1, ...potentialVideoReference);

		return { slices: sections, type: "VIDEO" };
	}

	return { slices: sections, type: "DIRECTORY" };
}

export function getParentPathFromPath(path: string): string {
	let pathSlices = splitPathIntoSlices(path);

	pathSlices.slices.splice(pathSlices.slices.length - 1, 1);

	return pathSlices.slices.join(" > ");
}

export function reformatDirectoryPath(path: string): string {
	const pathSlices = splitPathIntoSlices(path);

	if (pathSlices.type == "DIRECTORY") {
		return pathSlices.slices.join(" > ");
	}
	else {
		let video = pathSlices.slices[pathSlices.slices.length - 1];
		let base = pathSlices.slices.join(" > ");

		return `${base}:${video}`;
	}
}

export function directoryPathConcat(base: string, slice: string, type: NodeType): string {
	let slim = base.trim();

	if (slim.endsWith(">")) {
		slim = slim.slice(0, slim.length - 2);
	}

	slim = slim.trimEnd();

	return type == "DIRECTORY" ?
		`${slim} > ${slice.trim()}` :
		`${slim}:${slice}`;
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
