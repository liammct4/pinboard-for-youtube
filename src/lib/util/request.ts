export type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
export type HeaderArray = [string, string][];

export type HttpResponse = {
	status: number,
	body: any
}

export async function sendRequest(
		method: Method,
		url: string,
		body: any = null,
		headers: [string, string][] | null = null
	): Promise<HttpResponse | undefined> {
		
	let response: Response = await fetch(url, {
		method: method,
		headers: new Headers(headers ?? []),
		body: body == undefined ? undefined : JSON.stringify(body)
	});
	
	return { status: response.status, body: await response.text() };
}
