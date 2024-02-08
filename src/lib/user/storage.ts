import { IStorage } from "../storage/storage";
import { AuthenticationError, AuthenticationObject, IAuthenticatedUser, loginGetTokens } from "./accounts";

/**
 * Logs in a user using their email/password and saves it to local storage. (/auth/currentUser/).
 * @param email The inputted user email. 
 * @param password The inputted user password.
 */
export async function loginSaveUser(email: string, password: string): Promise<IAuthenticatedUser | undefined> {
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

	return storage.auth.currentUser!;
}

export async function getCurrentAuthenticatedUser(): Promise<IAuthenticatedUser | undefined> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.auth.currentUser;
}

export async function setCurrentAuthenticatedUser(user: IAuthenticatedUser): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	storage.auth.currentUser = user;

	await chrome.storage.local.set(storage);
}


export async function saveLogoutUser(): Promise<void> {
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
