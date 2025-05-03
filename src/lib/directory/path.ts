import { DIRECTORY_NAME_MAX_LENGTH, NodeType } from "./directory";

export type NodePath = {
	slices: string[],
	type: NodeType;
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
