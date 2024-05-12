import { DataMutation } from "../../../features/account/accountSlice";
import { tagsEndpoint } from "../../api/pinboardApi";
import { HttpStatusCode } from "../../util/http";
import { GlobalRequestHandler, HeaderArray, HttpResponse } from "../../util/request";
import { TagDefinition } from "../../video/video";

export async function getAccountCloudTags(
		idToken: string
	): Promise<TagDefinition[] | undefined> {
	let headers: HeaderArray = [["Authorization", idToken]];
	let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest("GET", tagsEndpoint, undefined, headers);
	
	if (response == undefined || response.status == HttpStatusCode.UNAUTHORIZED) {
		return undefined;
	}
	
	return JSON.parse(response.body) as TagDefinition[];
}

export async function pushAccountTagDefinitions(
		idToken: string,
		mutationQueue: DataMutation[],
		tagData: TagDefinition[]
	): Promise<HttpResponse | undefined> {
	let headers: HeaderArray = [["Authorization", idToken]];
	let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest("PATCH", tagsEndpoint, {
		data: tagData,
		mutations: mutationQueue
	}, headers);
	
	if (response == undefined || response.status == HttpStatusCode.UNAUTHORIZED) {
		return undefined;
	}
	
	return response;
}
