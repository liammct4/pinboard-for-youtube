import { accountsEndpoint } from "../api/pinboardApi";
import { HttpResponse, sendRequest } from "../util/request"

export function registerAccount(email: string, password: string): HttpResponse | undefined {
	return sendRequest("PUT", accountsEndpoint, {
		email: email,
		password: password
	});
}

export function resendEmailVerificationLink(email: string): HttpResponse | undefined {
	// TODO
	return undefined;
}
