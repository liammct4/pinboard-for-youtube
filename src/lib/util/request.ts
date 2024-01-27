export type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

export type HttpResponse = {
	status: number,
	body: any
}

export function sendRequest(
		method: Method,
		url: string,
		body: any = null,
		headers: Map<string, string> | null = null): HttpResponse | undefined {
	if (!navigator.onLine) {
		return undefined;
	}
	
	var request = new XMLHttpRequest();
	
	request.open(method, url, true);

	if (headers) {
		headers.forEach((key: string, value: string) => {
			request.setRequestHeader(key, value);
		});
	}

	request.send(JSON.stringify(body));

	return {
		status: request.status,
		body: request.responseText
	};
}
