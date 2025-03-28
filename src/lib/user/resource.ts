import { HttpStatusCode } from "../util/http";
import { GlobalRequestHandler, HeaderArray, HttpResponse } from "../util/request";

/**
 * Fetches a certain type of provided data resource from the server of
 * a user account. 
 * @param resource The resource to fetch. 
 * @param idToken The token associated with a user account.
 * @returns The data of that resource in the user account.
 */
export async function getAccountResourceData<T>(
		endpoint: string,
		idToken: string
	): Promise<T[] | undefined> {
	let headers: HeaderArray = [["Authorization", idToken]];
	let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest("GET", endpoint, undefined, headers);
	
	if (response == undefined || response.status == HttpStatusCode.UNAUTHORIZED) {
		return undefined;
	}
	
	return JSON.parse(response.body) as T[];
}
