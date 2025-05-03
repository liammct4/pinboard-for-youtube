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

export function getItemFromNode(path: string, node: IDirectoryNode): VideoBrowserNode | null {
	const slices = splitPathIntoSlices(path);

	let current: VideoBrowserNode = node;

	if (node.slice.trim() == slices.slices[0].trim()) {
		slices.slices.splice(0, 1);
	}
	else {
		return null;
	}

	for (let slice of slices.slices) {
		let found = false;

		if (current.type == "VIDEO") {
			// Means that there was an attempt to get a video from a sub video. e.g. /dirA/dirB/dirC/vidA/vidB, which isn't valid.
			return null;
		}

		for (let node of current.subNodes) {
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
export function getSectionRaw(node: VideoBrowserNode): string {
	if (node.type == "VIDEO") {
		return node.videoID;
	}
	else {
		return node.slice;
	}
}

export function getSectionFromPath(path: string): NodePath {
	let sections = splitPathIntoSlices(path);

	return { ...sections, slices: [sections.slices[sections.slices.length - 1]] };
}

export function getSectionPrefix(node: VideoBrowserNode): string {
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

export function getRootDirectoryPathFromSubNode(node: VideoBrowserNode): string {
	let slices: string[] = [ getSectionRaw(node) ];
	let current = node.parent;

	while (current != null) {
		slices.unshift(current.slice);

		current = current.parent;
	}

	if (node.type == "DIRECTORY") {
		return slices.join(" > ");
	}

	slices.splice(slices.length - 1, 1);
	let path = slices.join(" > ");

	return `${path}:${node.videoID}`;
}

export type RelocateItemError = 
	"RENAME_ALREADY_EXISTS" |
	"TARGET_DOESNT_EXIST" |
	"NEW_LOCATION_DOESNT_EXIST" |
	"MOVE_ALREADY_EXISTS";

export async function relocateItemToDirectory(root: IDirectoryNode, oldDirectory: string, newDirectory: string): Promise<RelocateItemError | null> {
	let oldSplit = splitPathIntoSlices(oldDirectory);
	let newSplit = splitPathIntoSlices(newDirectory);

	// Incase of just renaming the directory. No need to traverse.
	if (oldSplit.slices.length == newSplit.slices.length && newSplit.type == "DIRECTORY" && oldSplit.type == "DIRECTORY") {
		let equal = true;

		for (let i = 0; i < newSplit.slices.length - 1; i++) {
			if (oldSplit.slices[i] == newSplit.slices[i]) {
				continue;
			}

			equal = false;
			break;
		}

		// The first part of the path is equal, just the end might not be. (Renaming).
		if (equal) {
			let item = getItemFromNode(oldDirectory, root) as IDirectoryNode;

			let newName = newSplit.slices[newSplit.slices.length - 1];
			let alreadyExistingIndex = item.parent?.subNodes.findIndex(x => getSectionPrefix(x) == getSectionPrefixManual(newName, "DIRECTORY"));

			if (alreadyExistingIndex != -1) {
				return "RENAME_ALREADY_EXISTS";
			}

			item.slice = newName;
			return null;
		}
	}

	// Otherwise, move as normal.
	let itemToMove = getItemFromNode(oldDirectory, root) as VideoBrowserNode;

	if (itemToMove == undefined || itemToMove == null) {
		return "TARGET_DOESNT_EXIST";
	}

	// Getting new location.
	let newParentPath = [ ...newSplit.slices ];
	newParentPath.splice(newSplit.slices.length - 1, 1);

	let newParent = getItemFromNode(newParentPath.join(" > "), root);

	if (newParent == null || newParent.type != "DIRECTORY") {
		return "NEW_LOCATION_DOESNT_EXIST";
	}

	let alreadyExistingIndex = newParent.subNodes.findIndex(x => getSectionPrefix(x) == getSectionPrefix(itemToMove));

	if (alreadyExistingIndex != -1) {
		return "MOVE_ALREADY_EXISTS";
	}

	// Remove from old location.
	let oldParentIndex = itemToMove.parent!.subNodes.findIndex(x => getSectionPrefix(x) == getSectionPrefix(itemToMove)) as number;
	itemToMove.parent?.subNodes.splice(oldParentIndex, 1);

	// Place in new location.
	let directoryEndIndex = newParent.subNodes.findIndex(x => x.type == "VIDEO");

	if (directoryEndIndex == -1) {
		directoryEndIndex = newParent.subNodes.length;
	}

	let insertIndex: number;

	
	if (itemToMove.type == "DIRECTORY") {
		insertIndex = await getAlphanumericInsertIndex(newParent.subNodes, itemToMove, getSectionRaw, 0, directoryEndIndex);
	}
	else {
		// TypeScript acts up so it needs to be separate.
		let itemToMoveID = itemToMove.videoID;
		
		let storage = await accessStorage();
		insertIndex = await getAlphanumericInsertIndex(newParent.subNodes, itemToMove, () => storage.cache.videos.find(x => x.video_id == itemToMoveID)!.title, directoryEndIndex, newParent.subNodes.length);
	}

	newParent.subNodes.splice(insertIndex, 0, itemToMove);
	
	itemToMove.parent = newParent;

	return null;
}

export type AddDirectoryResult = "DOES_NOT_EXIST" | "NOT_A_DIRECTORY" | "DIRECTORY_ALREADY_EXISTS";

export type AddDirectorySuccess = [true, string];
export type AddDirectoryFail = [false, AddDirectoryResult];

// TODO: Replace with actual result type.
export async function addDirectory(root: IDirectoryNode, targetPath: string, name: string): Promise<AddDirectorySuccess | AddDirectoryFail> {
	let newParent = getItemFromNode(targetPath, root) as IDirectoryNode;

	if (newParent == undefined) {
		return [false, "DOES_NOT_EXIST"];
	}
	else if (newParent.type != "DIRECTORY") {
		return [false, "NOT_A_DIRECTORY"];
	}

	let existingIndex = newParent
		.subNodes
		.findIndex(x => getSectionPrefix(x) == getSectionPrefixManual(name, "DIRECTORY"));

	if (existingIndex != -1) {
		return [false, "DIRECTORY_ALREADY_EXISTS"];
	}

	let newDirectory: IDirectoryNode = {
		nodeID: crypto.randomUUID(),
		slice: name,
		parent: newParent,
		type: "DIRECTORY",
		subNodes: []
	};

	let videoStartIndex = newParent.subNodes.findIndex(x => x.type == "VIDEO");
	let insertIndex = await getAlphanumericInsertIndex(newParent.subNodes, newDirectory, (item) => getSectionPrefix(item), 0, videoStartIndex);

	newParent.subNodes.splice(insertIndex, 0, newDirectory);

	return [true, newDirectory.nodeID];
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

		accumulated = accumulated == "" ? getSectionRaw(node) : directoryPathConcat(accumulated, getSectionRaw(node), node.type);

		for (let subNode of node.subNodes) {
			let sectionPrefix = getSectionPrefix(subNode);

			if (subNode.type == "DIRECTORY") {
				if (includeDirectories && sectionPrefix == itemNameDirectory) {
					result.push(directoryPathConcat(accumulated, getSectionRaw(subNode), "DIRECTORY"));
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

export function cloneDirectory(root: IDirectoryNode): IDirectoryNode {
	const pass = (node: IDirectoryNode, parent: IDirectoryNode | null) => {
		const newNode = { ...node, parent }

		newNode.subNodes = node.subNodes.map(x => {
			if (x.type == "DIRECTORY") {
				return pass(x, newNode);
			}

			return { ...x, parent: newNode };
		})

		return newNode;
	}

	let newRoot = pass(root, null);

	return newRoot;
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
