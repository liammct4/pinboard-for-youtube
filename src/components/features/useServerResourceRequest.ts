import { current } from "@reduxjs/toolkit";
import { GlobalRequestHandler, HttpResponse, Method } from "../../lib/util/request";
import { useUserAccount } from "./useUserAccount"

const EXPIRED_TOKEN_MESSAGE = "The incoming token has expired";

export function useServerResourceRequest(endpoint: string) {
	const { isSignedIn, user } = useUserAccount();

	return {
		sendRequest: async (method: Method, body: string): Promise<HttpResponse | undefined> => {
			if (!isSignedIn) {
				return undefined;
			}

			let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest(method, endpoint, body, [
				[ "Authorization", user.tokens.IdToken ]
			]);

			return response;
		}
	}
}

