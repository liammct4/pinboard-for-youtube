import { HttpStatusCode } from "./http";

export type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
export type HeaderArray = [string, string][];
export type NetworkErrorType = "NoConnection" | "TimedOut";

export type HttpResponse = {
	status: number,
	body: any
}

export class RequestHandler {
	private _offlineHandler: (error: NetworkErrorType) => void | Promise<void> = () => { console.log("offline") };

	constructor() {
		
	}

	set offlineHandler(handler: (error: NetworkErrorType) => void | Promise<void>) {
		this._offlineHandler = handler;
	}
	
	async sendRequest(
			method: Method,
			url: string,
			body: any = null,
			headers: [string, string][] | null = null
		): Promise<HttpResponse | undefined> {
		if (!navigator.onLine) { 
			this._offlineHandler("NoConnection");
			return undefined;
		}

		let response: Response | undefined;

		try {

			response = await fetch(url, {
				method: method,
				headers: new Headers(headers ?? []),
				body: body == undefined ? undefined : JSON.stringify(body)
			});
		}
		catch (e) {
			if (!(e instanceof TypeError)) {
				throw e;
			}

			this._offlineHandler("TimedOut");
			return undefined;
		}

		if (response.status == HttpStatusCode.REQUEST_TIMEOUT) {
			this._offlineHandler("TimedOut");
			return undefined;
		}
		
		return { status: response.status, body: await response.text() };
	}
}


export const GlobalRequestHandler = new RequestHandler();
