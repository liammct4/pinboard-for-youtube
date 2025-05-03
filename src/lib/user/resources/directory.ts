import { IDirectoryNode } from "../../directory/directory";
import { directoriesEndpoint } from "../../api/pinboardApi";
import { addParentPass } from "../../storage/userData/userData";
import { HttpStatusCode } from "../../util/http";
import { HttpResponse } from "../../util/request";
import { sendApiRequestWithAuthorization } from "../resource";

export async function fetchDirectoryFromAPI(idToken: string): Promise<IDirectoryNode | undefined> {
	let response: HttpResponse | undefined = await sendApiRequestWithAuthorization(idToken, "GET", directoriesEndpoint);

	if (response == undefined) {
		return undefined;
	}

	if (response.status != HttpStatusCode.OK) {
		console.error(`Error fetching directory root: ${response.status}: ${response.body}`)
		return undefined;
	}

	let serverRoot = JSON.parse(response.body) as IDirectoryNode;
	addParentPass(serverRoot);

	return serverRoot;
};
