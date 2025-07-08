import { useDispatch } from "react-redux";
import { authActions } from "../../../features/auth/authSlice";
import { regenerateTokensWithRefreshToken } from "../../../lib/user/accounts";
import { HttpStatusCode } from "../../../lib/util/http";
import { GlobalRequestHandler, NetworkErrorType } from "../../../lib/util/request";
import { useNotificationMessage } from "../notifications/useNotificationMessage";
import { IWrapperProperties } from "../wrapper";
import { useUserAccount } from "../useUserAccount";

export function RequestHandlerWrapper({ children }: IWrapperProperties) {
	const { activateMessage } = useNotificationMessage();
	const { isSignedIn, user } = useUserAccount();
	const dispatch = useDispatch();

	// Setup handler.
	GlobalRequestHandler.offlineHandler = (type: NetworkErrorType) => {
		let error: string;
		
		switch (type) {
			case "NoConnection":
				error = "You appear to be offline, please check your internet connection.";
				break;
			case "TimedOut":
				error = "There was a problem reaching the server, please try again later.";
				break;
		}

		setTimeout(() => activateMessage(
			type == "TimedOut" ? "Something went wrong" : undefined,
			error,
			"Error",
			"InternetGlobe",
			-1), 100);
	}
	GlobalRequestHandler.unauthorizedResolver = async (originalRequest, originalResponse) => {
		// Should never happen since no request will be made.
		if (!isSignedIn) {
			activateMessage("Something unexpected happened", "An unexpected error has occurred. Please dismiss this message", "Error", "Error", 7000, "Shake");
			return { success: false, response: originalResponse };
		}

		let newTokens = await regenerateTokensWithRefreshToken(user.tokens.RefreshToken);

		// Return the original response since the refresh token has expired or is invalid.
		if (newTokens == undefined) {
			return { success: false, response: originalResponse };
		}

		let newHeaders = originalRequest.headers ?? [];
		let authIndex =	newHeaders.findIndex(x => x[0] == "Authorization");

		// Replace the expired ID token.
		if (authIndex != -1) {
			newHeaders[authIndex][1] = newTokens.idToken;
		}
		
		let reattemptedRequest = await fetch(originalRequest.url, {
			method: originalRequest.method,
			headers: new Headers(newHeaders),
			body: originalRequest.body == undefined ? undefined : JSON.stringify(originalRequest.body)
		});

		// Successful, replace expired tokens in storage.
		if (reattemptedRequest.status != HttpStatusCode.UNAUTHORIZED) {
			dispatch(authActions.setAccessAndIDTokens({
				idToken: newTokens!.idToken,
				accessToken: newTokens!.accessToken
			}));
		}

		return { success: true, response: reattemptedRequest };
	}

	return children;
}
