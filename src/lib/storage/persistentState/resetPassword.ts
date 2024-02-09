import { IStorage } from "../storage";
import { RESET_PASSWORD_PATH } from "./persistentState";

export interface IResetPasswordState {
	email: string;
}

export async function startResetPasswordPersistentState(state: IResetPasswordState | undefined): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	storage.persistentState.path = RESET_PASSWORD_PATH;
	storage.persistentState.resetPasswordState = state;

	await chrome.storage.local.set(storage);
}

export async function setResetPasswordPersistentState(state: IResetPasswordState | undefined): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	storage.persistentState.resetPasswordState = state;

	await chrome.storage.local.set(storage);
}

export async function getResetPasswordPersistentState(): Promise<IResetPasswordState | undefined> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.persistentState.resetPasswordState;
}

export async function endResetPasswordPersistentState(): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	storage.persistentState.path = undefined;
	storage.persistentState.resetPasswordState = undefined;

	await chrome.storage.local.set(storage);
}
