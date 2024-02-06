import { accountsEndpoint, sessionEndpoint } from "../api/pinboardApi";
import { HttpStatusCode } from "../util/http";
import { HttpResponse, sendRequest } from "../util/request"
import { IStorage } from "../storage/storage";

export class AuthenticationError extends Error {

}

export type AuthenticationObject = {
	accessToken: string;
	refreshToken: string;
	identityToken: string;
}

export interface IAuthenticatedUser  {
	email: string;
	tokens: AuthenticationObject;
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

export function resendEmailVerificationLink(email: string): HttpResponse | undefined {
	// TODO
	return undefined;
}

/**
 * Logs in a user using their email/password and saves it to local storage. (/auth/currentUser/).
 * @param email The inputted user email. 
 * @param password The inputted user password.
 */
export async function loginSaveUser(email: string, password: string): Promise<void> {
	let tokens: AuthenticationObject | undefined = loginGetTokens(email, password);

	let storage: IStorage = await chrome.storage.local.get() as IStorage;
	
	if (tokens == undefined) {
		throw new AuthenticationError("Email/password was not valid.");
	}

	storage.auth.currentUser = {
		email: email,
		tokens: tokens
	};

	await chrome.storage.local.set(storage);
}

export async function logoutUser(): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	if (storage.auth.currentUser != undefined) {
		storage.auth.currentUser = undefined;

		await chrome.storage.local.set(storage);
	}
}

export async function getStoredAuthTokens(): Promise<AuthenticationObject | undefined> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.auth.currentUser?.tokens;
}

/**
 * DO NOT USE WHEN LOGGING IN, USE loginSaveUser(). This is just for refreshing the tokens.
 */
export async function setStoredAuthTokens(tokens: AuthenticationObject): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	if (storage.auth.currentUser == undefined) {
		throw new Error("No user is logged in.");
	}

	storage.auth.currentUser.tokens = tokens;

	await chrome.storage.local.set(storage);
}
