import { DIRECTORY_NAME_MAX_LENGTH, NodeType } from "./directory";

export type NodePath = {
	slices: string[],
	type: NodeType;
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
	if (directoryName.length < 1) {
		return "EMPTY";
	}
	else if (directoryName.length > DIRECTORY_NAME_MAX_LENGTH) {
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
export function parsePath(path: string): NodePath {
	let sections = path.split(">").map(x => x.trim());

	let potentialVideoReference: string[] = sections[sections.length - 1].split(":");

	if (potentialVideoReference.length == 2)
	{
		sections.splice(sections.length - 1, 1, ...potentialVideoReference);

		return { slices: sections, type: "VIDEO" };
	}

	return { slices: sections, type: "DIRECTORY" };
}

export function getParentPathFromPath(path: NodePath): NodePath {
	let newPath = [ ...path.slices ];
	newPath.splice(newPath.length - 1, 1);

	return {
		slices: newPath,
		type: "DIRECTORY"
	};
}

export function reformatDirectoryPath(path: string): string {
	const pathSlices = parsePath(path);

	return pathToString(pathSlices);
}

export function directoryPathConcat(path: NodePath, section: string, type: NodeType): NodePath {
	return {
		slices: [ ...path.slices, section ],
		type
	}
}

export function pathToString(path: NodePath): string {
	if (path.type == "DIRECTORY") {
		return path.slices.join(" > ");
	}

	let videoID = path.slices.splice(path.slices.length - 1, 1)[0];
	let basePath = path.slices.join(" > ");

	return `${basePath}:${videoID}`;
}

export function pathEquals(a: NodePath, b: NodePath): boolean {
	if (a.slices.length != b.slices.length) {
		return false;
	}

	for (let i = 0; i < a.slices.length; i++) {
		if (a.slices[i] != b.slices[i]) {
			return false;
		}
	}

	return a.type == b.type;
}
