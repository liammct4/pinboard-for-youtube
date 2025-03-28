import { accountsEndpoint, sessionEndpoint } from "../api/pinboardApi";
import { HttpStatusCode } from "../util/http";
import { HeaderArray, HttpResponse, GlobalRequestHandler } from "../util/request"

export type AuthenticationObject = {
	AccessToken: string;
	RefreshToken: string;
	IdToken: string;
}

export type TemporaryTokens = {
	idToken: string;
	accessToken: string;
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
export async function registerAccount(email: string, password: string): Promise<HttpResponse | undefined> {
	return GlobalRequestHandler.sendRequest("PUT", accountsEndpoint, {
		email: email,
		password: password
	});
}

export async function invalidateRefreshToken(refreshToken: string, idToken: string): Promise<HttpResponse | undefined> {
	const headers: HeaderArray = [["Authorization", idToken]];

	return GlobalRequestHandler.sendRequest("DELETE", sessionEndpoint, {
		refreshToken: refreshToken
	}, headers);
}

export async function deleteUserAccount(email: string, password: string, tokens: AuthenticationObject): Promise<HttpResponse | undefined> {
	const headers: HeaderArray = [["Authorization", tokens.IdToken]];

	return GlobalRequestHandler.sendRequest("DELETE", accountsEndpoint, {
		userDetails: {
			email: email,
			password: password
		},
		accessToken: tokens.AccessToken
	}, headers);
}

export async function changeUserEmail(currentEmail: string, newEmail: string, tokens: AuthenticationObject): Promise<HttpResponse | undefined> {
	const headers: HeaderArray = [["Authorization", tokens.IdToken]];

	return GlobalRequestHandler.sendRequest("PATCH", accountsEndpoint, {
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

	return GlobalRequestHandler.sendRequest("PATCH", accountsEndpoint, {
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
	return GlobalRequestHandler.sendRequest("POST", accountsEndpoint, {
		type: "RESET_PASSWORD",
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
	return GlobalRequestHandler.sendRequest("POST", accountsEndpoint, {
		type: "RESET_PASSWORD",
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
	let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest("GET", sessionEndpoint, undefined, headers);

	if (response == undefined || response.status == HttpStatusCode.UNAUTHORIZED) {
		return undefined;
	}

	return JSON.parse(response.body) as AuthenticationObject;
}

/**
 * Generates new access and identity tokens from a refresh token.
 * @param refreshToken A refresh token associated with an account.
 * @returns A new set of id and access tokens.
 */
export async function regenerateTokensWithRefreshToken(refreshToken: string): Promise<TemporaryTokens | undefined> {
	let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest("POST", sessionEndpoint, { refreshToken });

	if (response == undefined || response.status != HttpStatusCode.OK) {
		return undefined;
	}

	return JSON.parse(response.body);
}

/**
 * Resends a verification link to a newly created user account.
 * @param email The email to send a link to.
 * @returns OK (200) if everything was successful.
 */
export async function resendEmailVerificationLink(email: string): Promise<HttpResponse | undefined> {
	let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest("POST", accountsEndpoint, {
		type: "RESEND_VERIFY_EMAIL",
		requestedEmail: email
	});

	if (response == undefined || response.status == HttpStatusCode.UNAUTHORIZED) {
		return undefined;
	}

	return response;
}
