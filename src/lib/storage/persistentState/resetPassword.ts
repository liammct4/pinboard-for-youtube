import { IStorage, modifyStorage } from "../storage";
import { RESET_PASSWORD_PATH } from "./persistentState";

export interface IResetPasswordState {
	email: string;
}

export async function startResetPasswordPersistentState(state: IResetPasswordState | undefined): Promise<void> {
	modifyStorage(storage => {
		storage.persistentState.path = RESET_PASSWORD_PATH;
		storage.persistentState.resetPasswordState = state;
	});
}

export async function setResetPasswordPersistentState(state: IResetPasswordState | undefined): Promise<void> {
	modifyStorage(storage => storage.persistentState.resetPasswordState = state);
}

export async function endResetPasswordPersistentState(): Promise<void> {
	modifyStorage(storage => {
		storage.persistentState.path = undefined;
		storage.persistentState.resetPasswordState = undefined;
	});
}
