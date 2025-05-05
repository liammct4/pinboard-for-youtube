import { IDirectoryNode } from "../../directory/directory";
import { directoriesEndpoint } from "../../api/pinboardApi";
import { HttpStatusCode } from "../../util/http";
import { HttpResponse } from "../../util/request";
import { sendApiRequestWithAuthorization } from "../resource";

export type DirectoryAction = "Create" | "Rename" | "Delete" | "Move";
export type DirectoryActionType = "Video" | "Directory"; 

export interface IDirectoryModificationAction {
	path: string;
	data?: string | undefined;
	action: DirectoryAction;
	type: DirectoryActionType;
}

export async function fetchDirectoryFromAPI(_idToken: string): Promise<IDirectoryNode | undefined> {
	// TODO.
	throw Error();
};
