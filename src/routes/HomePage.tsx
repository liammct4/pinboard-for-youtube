import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ReactComponent as PfyLogo } from "./../../assets/logo/logo.svg"
import { useNotificationMessage } from "../components/features/notifications/useNotificationMessage";
import { ConnectionEventType, GlobalRequestHandler, NetworkErrorType } from "../lib/util/request";
import { getCurrentAuthenticatedUser } from "../lib/user/storage";
import { useDispatch } from "react-redux";
import { setAccessAndIDTokens } from "../features/auth/authSlice";
import { regenerateTokensWithRefreshToken } from "../lib/user/accounts";
import { HttpStatusCode } from "../lib/util/http";

export function HomePage(): React.ReactNode {
	const navigate = useNavigate();
	const { activateMessage } = useNotificationMessage();
	const dispatch = useDispatch();
	// Setup offline network handler.
	useEffect(() => {
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
			let user = await getCurrentAuthenticatedUser();

			// Should never happen since no request will be made.
			if (user == undefined) {
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
				dispatch(setAccessAndIDTokens({
					idToken: newTokens!.idToken,
					accessToken: newTokens!.accessToken
				}));
			}

			return { success: true, response: reattemptedRequest };
		},
		GlobalRequestHandler.connectionChangedHandler = (type: ConnectionEventType) => {
			if (type == "Reconnected") {
				// TODO.
			}
		}
	}, []);

	return (
		<div className="outer-body">
			<div className="header-area">
				<PfyLogo className="extension-logo"/>
				<h1 className="extension-title">Pinboard for YouTube</h1>
				<hr className="bold-separator"></hr>
			</div>
			<div className="inner-body-content">
				<Outlet/>
			</div>
			<div className="footer-area">
				<hr className="bold-separator"></hr>
				<div className="button-options">
					<button className="button-base button-small"
						onClick={() => navigate("menu/options")}>Options</button>
					<button className="button-base button-small"
						onClick={() => navigate("menu/help")}>Help</button>
				</div>
				<h2 className="extension-version">Version 1.0.0</h2>
			</div>
		</div>
	);
}
