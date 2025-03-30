import { GlobalRequestHandler, HttpResponse, Method } from "../../../lib/util/request";
import { useUserAccount } from "../useUserAccount";

export function useServerResourceRequest(endpoint: string) {
	const { isSignedIn, user } = useUserAccount();

	return {
		sendRequest: async (method: Method, body?: string | undefined): Promise<HttpResponse | undefined> => {
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

