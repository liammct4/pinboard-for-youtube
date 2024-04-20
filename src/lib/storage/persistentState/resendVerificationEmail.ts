import { IStorage } from "../storage";
import { RESEND_VERIFICATION_EMAIL_PATH } from "./persistentState";

export interface IResendVerificationEmailState {
	email: string;
}

export async function startResendVerfiyEmailState(state: IResendVerificationEmailState | undefined): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	storage.persistentState.path = RESEND_VERIFICATION_EMAIL_PATH;
	storage.persistentState.resendVerificationEmailState = state;

	await chrome.storage.local.set(storage);
}

export async function setResendVerfiyEmailState(state: IResendVerificationEmailState | undefined): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	storage.persistentState.resendVerificationEmailState = state;

	await chrome.storage.local.set(storage);
}

export async function getResendVerfiyEmailState(): Promise<IResendVerificationEmailState | undefined> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.persistentState.resendVerificationEmailState;
}

export async function endResendVerfiyEmailState(): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	storage.persistentState.path = undefined;
	storage.persistentState.resendVerificationEmailState = undefined;

	await chrome.storage.local.set(storage);
}
