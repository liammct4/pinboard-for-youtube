import { HttpStatusCode } from "./http";

export type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
export type HeaderArray = [string, string][];
export type NetworkErrorType = "NoConnection" | "TimedOut";
export type UnauthorizedResolver = (originalRequest: RequestInfo, originalResponse: HttpResponse) => ResolveAttempt | Promise<ResolveAttempt>;
export type RequestInfo = {
	method: Method;
	url: string;
	body: any;
	headers: [string, string][] | null;
}
export type ResolveAttempt = {
	success: boolean;
	response: HttpResponse;
}

export type HttpResponse = {
	status: number,
	body: any
}

export class RequestHandler {
	private _offlineHandler: (error: NetworkErrorType) => void | Promise<void> = () => { };
	private _unauthorizedResolver: UnauthorizedResolver = () => null!;
	// Whenever an unauthorized error occurs, it is important to disable the unauthorized resolver
	// from responding to the error if it is still happening to prevent recursion of handlers causing
	// the handler to trigger again.
	private lockUnauthorizedHandler: boolean = false;

	set offlineHandler(handler: (error: NetworkErrorType) => void | Promise<void>) {
		this._offlineHandler = handler;
	}

	set unauthorizedResolver(handler: UnauthorizedResolver) {
		this._unauthorizedResolver = handler;
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
		else if (response.status == HttpStatusCode.UNAUTHORIZED && !this.lockUnauthorizedHandler) {
			// An attempt is given to resolve the unauthorized error.
			this.lockUnauthorizedHandler = true;

			let attempt = await this._unauthorizedResolver({ method, url, body, headers }, response);

			this.lockUnauthorizedHandler = false;
			
			if (attempt.success) {
				return attempt.response;
			}
		}
		
		return { status: response.status, body: await response.text() };
	}
}

export const GlobalRequestHandler = new RequestHandler();
