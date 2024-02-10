import { useDispatch } from "react-redux";
import { accountsEndpoint, sessionEndpoint } from "../api/pinboardApi";
import { HttpStatusCode } from "../util/http";
import { HeaderArray, HttpResponse, sendRequest } from "../util/request"
import { IStorage } from "../storage/storage";
import { loginSaveUser } from "./storage";
import { setCurrentUser } from "../../features/auth/authSlice";

export class AuthenticationError extends Error {

}

export type AuthenticationObject = {
	AccessToken: string;
	RefreshToken: string;
	IdToken: string;
}

export interface IAuthenticatedUser  {
	email: string;
	tokens: AuthenticationObject;
}

export function useLogin() {
	const dispatch = useDispatch();

	const attemptLogin = async (email: string, password: string) => {
		let newlyAuthenticatedUser: IAuthenticatedUser | undefined = await loginSaveUser(email, password);

		dispatch(setCurrentUser(newlyAuthenticatedUser));
		return newlyAuthenticatedUser != undefined;
	}

	return { attemptLogin };
}

/**
 * Creates a new unverified account, a verification email will be sent to the email provided.
 * @param email The user email, needs to be unique.
 * @param password The user password.
 * @returns Response from API.
 */
export async function registerAccount(email: string, password: string): Promise<HttpResponse | undefined> {
	return sendRequest("PUT", accountsEndpoint, {
		email: email,
		password: password
	});
}

export async function invalidateRefreshToken(refreshToken: string, idToken: string): Promise<HttpResponse | undefined> {
	const headers: HeaderArray = [["Authorization", idToken]];

	return sendRequest("DELETE", sessionEndpoint, {
		refreshToken: refreshToken
	}, headers);
}

export async function deleteUserAccount(email: string, password: string, tokens: AuthenticationObject): Promise<HttpResponse | undefined> {
	const headers: HeaderArray = [["Authorization", tokens.IdToken]];

	return sendRequest("DELETE", accountsEndpoint, {
		userDetails: {
			email: email,
			password: password
		},
		accessToken: tokens.AccessToken
	}, headers);
}

export async function changeUserEmail(currentEmail: string, newEmail: string, tokens: AuthenticationObject): Promise<HttpResponse | undefined> {
	const headers: HeaderArray = [["Authorization", tokens.IdToken]];

	return sendRequest("PATCH", accountsEndpoint, {
		userDetails: {
			email: currentEmail,
			password: null
		},
		updatedDetails: {
			email: newEmail,
			password: null
		},
		accessToken: tokens.AccessToken
	}, headers);
}

export async function changeUserPassword(email: string, previousPassword: string, newPassword: string, tokens: AuthenticationObject): Promise<HttpResponse | undefined> {
	const headers: HeaderArray = [["Authorization", tokens.IdToken]];

	return sendRequest("PATCH", accountsEndpoint, {
		userDetails: {
			email: email,
			password: previousPassword
		},
		updatedDetails: {
			email: null,
			password: newPassword
		},
		accessToken: tokens.AccessToken
	}, headers);
}

/**
 * Initiates a reset password request, an email will be sent to the users email (after matching the account's email)
 * which contains a reset code. This is then used with the `confirmResetPassword()` function to reset a user's password.
 * @param email The account email to reset.
 * @returns The response from the server.
 */
export async function startResetPassword(email: string): Promise<HttpResponse | undefined> {
	return sendRequest("POST", accountsEndpoint, {
		getCode: {
			email: email
		},
		setPassword: null
	});
}

/**
 * Changes a user's password with a provided code sent to the users email. `startResetPassword()` is used to initiate
 * a reset password request and get the code.
 * @param email The email address for the user.
 * @param newPassword The new password.
 * @param code The verification code from the users email.
 * @returns The response from the server.
 */
export async function confirmResetPassword(email: string, newPassword: string, code: string): Promise<HttpResponse | undefined> {
	return sendRequest("POST", accountsEndpoint, {
		getCode: null,
		setPassword: {
			code: code,
			email: email,
			password: newPassword
		}
	});
}

/**
 * Authenticates a user via their email/password. Used when logging in, provides refresh, id and access tokens.
 * @param email The provided user email.
 * @param password The provided user password.
 * @returns An object containing the tokens from the API. Or nothing if the authentication failed (e.g. invalid email/password).
 */
export async function loginGetTokens(email: string,password: string): Promise<AuthenticationObject | undefined> {
	let details = btoa(JSON.stringify({
		email: email,
		password: password
	}));

	let headers: HeaderArray = [["Authorization", details]];
	let response: HttpResponse | undefined = await sendRequest("GET", sessionEndpoint, undefined, headers);

	if (response == undefined || response.status == HttpStatusCode.UNAUTHORIZED) {
		return undefined;
	}

	return JSON.parse(response.body) as AuthenticationObject;
}

export function resendEmailVerificationLink(_email: string): HttpResponse | undefined {
	// TODO
	return undefined;
}

export async function userIsLoggedIn(): Promise<boolean> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.auth.currentUser != undefined;
} 
