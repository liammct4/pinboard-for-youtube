import { accountsEndpoint, sessionEndpoint } from "../api/pinboardApi";
import { HttpStatusCode } from "../util/http";
import { HttpResponse, sendRequest } from "../util/request"
import { IStorage } from "../storage/storage";
import { loginSaveUser } from "./storage";
import { setCurrentUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

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
	}

	return { attemptLogin };
}

/**
 * Creates a new unverified account, a verification email will be sent to the email provided.
 * @param email The user email, needs to be unique.
 * @param password The user password.
 * @returns Response from API.
 */
export function registerAccount(email: string, password: string): HttpResponse | undefined {
	return sendRequest("PUT", accountsEndpoint, {
		email: email,
		password: password
	});
}

export function deleteUserAccount(email: string, password: string, tokens: AuthenticationObject): HttpResponse | undefined {
	const headers = new Map<string, string>();
	headers.set("Authorization", tokens.IdToken);

	return sendRequest("DELETE", accountsEndpoint, {
		userDetails: {
			email: email,
			password: password
		},
		accessToken: tokens.AccessToken
	}, headers);
}

export function changeUserEmail(currentEmail: string, newEmail: string, tokens: AuthenticationObject): HttpResponse | undefined {
	const headers = new Map<string, string>();
	headers.set("Authorization", tokens.IdToken);

	return sendRequest("POST", accountsEndpoint, {
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

export function changeUserPassword(email: string, previousPassword: string, newPassword: string, tokens: AuthenticationObject): HttpResponse | undefined {
	const headers = new Map<string, string>();
	headers.set("Authorization", tokens.IdToken);

	return sendRequest("POST", accountsEndpoint, {
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
 * Authenticates a user via their email/password. Used when logging in, provides refresh, id and access tokens.
 * @param email The provided user email.
 * @param password The provided user password.
 * @returns An object containing the tokens from the API. Or nothing if the authentication failed (e.g. invalid email/password).
 */
export function loginGetTokens(email: string, password: string): AuthenticationObject | undefined {
	let headers = new Map();

	headers.set("Authorization", btoa(JSON.stringify({
		email: email,
		password: password
	})));
	
	let response: HttpResponse | undefined = sendRequest("GET", sessionEndpoint, undefined, headers);

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
