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
	
	request.open(method, url, false);

	if (headers) {
		headers.forEach((value: string, key: string) => {
			request.setRequestHeader(key, value);
		});
	}

	request.send(body != null ? JSON.stringify(body) : body);

	return {
		status: request.status,
		body: request.responseText
	};
}
