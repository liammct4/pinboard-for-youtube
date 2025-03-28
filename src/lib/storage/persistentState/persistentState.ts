/* persistentState.ts
 *
 * The role of persistent state in storage is to provide temporary state saving across sessions.
 * E.g, when the user needs to exit the extension (for example, getting a verification code from their email).
 * The state and path is saved for instant opening.
 * 
 * Each type of state (e.g. Reset Password, Verify email) has a function to get the state from storage,
 * enable the state (with values) and end the state.
 */

import { IStorage } from "../storage";
import { IResendVerificationEmailState } from "./resendVerificationEmail";
import { IResetPasswordState } from "./resetPassword";

export const RESET_PASSWORD_PATH: string = "/app/menu/options/accounts/login/forgot password";
export const RESEND_VERIFICATION_EMAIL_PATH: string = "/app/menu/options/accounts/register/success";

export interface IPersistentState {
	path: string | undefined;
	resetPasswordState: IResetPasswordState | undefined;
	resendVerificationEmailState?: IResendVerificationEmailState | undefined;
}
