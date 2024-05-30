import { DataMutation, ServerResourceType } from "../../../features/account/accountSlice";
import { getResourceEndPoint } from "../../api/pinboardApi";
import { HttpStatusCode } from "../../util/http";
import { GlobalRequestHandler, HeaderArray, HttpResponse } from "../../util/request";

/**
 * Fetches a certain type of provided data resource from the server of
 * a user account. 
 * @param resource The resource to fetch. 
 * @param idToken The token associated with a user account.
 * @returns The data of that resource in the user account.
 */
export async function getAccountResourceData<T>(
		resource: ServerResourceType,
		idToken: string
	): Promise<T[] | undefined> {
	let headers: HeaderArray = [["Authorization", idToken]];
	let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest("GET", getResourceEndPoint(resource), undefined, headers);
	
	if (response == undefined || response.status == HttpStatusCode.UNAUTHORIZED) {
		return undefined;
	}
	
	return JSON.parse(response.body) as T[];
}

/**
 * Pushes provided data to a user account server resource/endpoint.
 * @param resource The resource to push to.
 * @param idToken The identity token associated with a user accont.
 * @param mutationQueue The mutation queue for the data.
 * @param data The provided data for the resource.
 * @returns A HTTP response indicating the result of the pushed data.
 */
export async function pushAccountResourceData<T>(
		resource: ServerResourceType,
		idToken: string,
		mutationQueue: DataMutation[],
		data: T[]
	): Promise<HttpResponse | undefined> {
	let headers: HeaderArray = [["Authorization", idToken]];
	let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest("PATCH", getResourceEndPoint(resource), {
		data: data,
		mutations: mutationQueue
	}, headers);
	
	if (response == undefined || response.status == HttpStatusCode.UNAUTHORIZED) {
		return undefined;
	}
	
	return response;
}
