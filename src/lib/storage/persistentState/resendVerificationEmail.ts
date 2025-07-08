import { modifyStorage } from "../storage";
import { RESEND_VERIFICATION_EMAIL_PATH } from "./persistentState";

export interface IResendVerificationEmailState {
	email: string;
}

export async function startResendVerfiyEmailState(state: IResendVerificationEmailState | undefined): Promise<void> {
	modifyStorage(storage => {
		storage.persistentState.path = RESEND_VERIFICATION_EMAIL_PATH;
		storage.persistentState.resendVerificationEmailState = state;
	});
}

export async function setResendVerfiyEmailState(state: IResendVerificationEmailState | undefined): Promise<void> {
	modifyStorage(storage => storage.persistentState.resendVerificationEmailState = state);
}

export async function endResendVerfiyEmailState(): Promise<void> {
	modifyStorage(storage => {
		storage.persistentState.path = undefined;
		storage.persistentState.resendVerificationEmailState = undefined;
	});
}
