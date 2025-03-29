import { GlobalRequestHandler, HeaderArray, HttpResponse, Method } from "../util/request";

export async function sendApiRequestWithAuthorization(idToken: string, method: Method, url: string, body?: any, headers?: HeaderArray): Promise<HttpResponse | undefined> {
	let headersWithAuth: HeaderArray = [...(headers ?? []), ["Authorization", idToken]];
	let response = await GlobalRequestHandler.sendRequest(method, url, body, headersWithAuth);

	return response;
}
