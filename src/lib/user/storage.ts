import { AuthenticationObject, IAuthenticatedUser, loginGetTokens } from "./accounts";
import { IStorage } from "../storage/storage";

/**
 * Logs in a user using their email/password and saves it to local storage. (/auth/currentUser/).
 * @param email The inputted user email. 
 * @param password The inputted user password.
 */
export async function loginSaveUser( email: string, password: string): Promise<IAuthenticatedUser | undefined> {
	let tokens: AuthenticationObject | undefined = await loginGetTokens(email, password)
	let storage: IStorage = await chrome.storage.local.get() as IStorage;
	
	if (tokens == undefined) {
		return undefined;
	}

	let newlyAuthenticatedUser: IAuthenticatedUser = {
		email: email,
		tokens: tokens
	};

	storage.auth.currentUser = newlyAuthenticatedUser;

	await chrome.storage.local.set(storage);

	return newlyAuthenticatedUser;
}
