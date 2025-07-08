import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGenericErrorMessage, useNotificationMessage } from "../../../../../../components/features/notifications/useNotificationMessage";
import { FormStyleContext } from "../../../../../../components/input/formStyleContext";
import { confirmResetPassword, startResetPassword } from "../../../../../../lib/user/accounts";
import { UserDetailsForm, UserDetailsFormPrimitive } from "../../UserDetailsForm/UserDetailsFormPrimitive";
import { HttpResponse } from "../../../../../../lib/util/request";
import { HttpStatusCode } from "../../../../../../lib/util/http";
import { endResetPasswordPersistentState, setResetPasswordPersistentState, startResetPasswordPersistentState } from "../../../../../../lib/storage/persistentState/resetPassword";
import { TextInput } from "../../../../../../components/input/TextInput/TextInput";
import "./ForgotPassword.css"
import { getItemFromStorage } from "../../../../../../lib/storage/storage";
import { ValidatedForm } from "../../../../../../components/forms/ValidatedForm";
import { MediumInputButton } from "../../../../../../components/interactive/buttons/MediumButton/MediumButton";

type ResetPasswordFormField = "verificationCode" | "newPassword" | "reenterNewPassword";
type ResetPasswordForm = {
	verificationCode: string;
	newPassword: string;
	reenterNewPassword: string;
}

function useEmailSubmit() {
	const { activateMessage } = useNotificationMessage();
	const { activateError } = useGenericErrorMessage();

	const onEmailSubmit = async (value: UserDetailsForm) => {
		activateMessage(undefined, "Sending a link...", "Info", "Info", -1);

		let response: HttpResponse | undefined = await startResetPassword(value.email);

		if (response == undefined) {
			return undefined;
		}
		
		if (response.status != HttpStatusCode.OK) {
			activateError();
			return;
		}

		activateMessage(
			undefined,
			"A verification code has been sent to your email address. Please make sure that you check your spam folder.",
			"Info",
			"Info",
			8000
		);

		let state = getItemFromStorage(s => s.persistentState.resetPasswordState);

		if (state == undefined) {
			await startResetPasswordPersistentState({ email: value.email });
		}
		else {
			// Although it looks identical to above, this updates it if multiple codes are sent.
			await setResetPasswordPersistentState({ email: value.email });
		}
	}

	return { onEmailSubmit };
}

function useCodePasswordSubmit() {
	const { activateMessage } = useNotificationMessage();
	const navigate = useNavigate();

	const onCodePasswordSubmit = async (value: ResetPasswordForm) => {
		let state = await getItemFromStorage(s => s.persistentState.resetPasswordState);

		if (state == undefined) {
			activateMessage(undefined, "Please send a verification code first.", "Warning", "Warning", 5000);
			return;
		}

		if (value.newPassword != value.reenterNewPassword) {
			activateMessage(undefined, "Password re-entered did not match.", "Warning", "Warning", 5000);
			return;
		}

		let response: HttpResponse | undefined = await confirmResetPassword(state.email, value.newPassword, value.verificationCode);
		
		switch (response?.status) {
			case HttpStatusCode.OK:
				activateMessage("Password reset", "Your password has been successfully reset, please login.", "Success", "Tick", 7000);
				await endResetPasswordPersistentState();

				setTimeout(() => navigate(".."), 10);
				break;
			case HttpStatusCode.UNPROCESSABLE_ENTITY:
				activateMessage("Something went wrong", response.body, "Error", "Error", 7000);
				break;
		}
	}

	return { onCodePasswordSubmit };
}

export function ForgotPassword(): React.ReactNode {
	const [ newPasswordFormVisible, setNewPasswordVisible ] = useState<boolean>(false);
	const { onEmailSubmit } = useEmailSubmit();
	const { onCodePasswordSubmit } = useCodePasswordSubmit();

	// Use effects are needed because async functions cannot be used directly in component level.
	useEffect(() => {
		const checkCodeSent = async () => {
			let state = await getItemFromStorage(s => s.persistentState.resetPasswordState);
			setNewPasswordVisible(state != undefined);
		};

		checkCodeSent();
	}, [])

	return (
		<div className="forgot-password-page">
			<p className="paragraph-regular">
				If you have forgot your password, please re-enter your email address to reset it.<br/><br/>

				<i>Don't worry, you can close the extension and open your email. You can also send multiple codes.</i>
			</p>
			<ValidatedForm
				name="reset-password-email-form"
				onSuccess={(data: UserDetailsForm) => {
					setNewPasswordVisible(true);
					onEmailSubmit(data);
				}}>
				<UserDetailsFormPrimitive
					showPassword={false}/>
			</ValidatedForm>
			<MediumInputButton
				form="reset-password-email-form"
				type="submit"
				className="send-reset-email-button"
				value="Send password reset email"/>
			{newPasswordFormVisible ?
				<>
					<h2 className="verification-text">Please enter the code sent to your email address:</h2>
					<ValidatedForm<ResetPasswordForm, ResetPasswordFormField>
						className="reset-password-form"
						name="reset-password-form"
						onSuccess={(data) => onCodePasswordSubmit(data)}>
							<FormStyleContext.Provider value={{ labelSize: "large" }}>
								<TextInput<ResetPasswordFormField>
									label="Verification Code"
									title="Enter the verification code sent to your email address."
									name="verificationCode"
									fieldSize="small"
									startValue=""/>
								<TextInput<ResetPasswordFormField>
									label="New Password"
									title="Enter your new password."
									name="newPassword"
									fieldSize="medium"
									startValue=""
									textInputType="password"/>
								<TextInput<ResetPasswordFormField>
									label="Re-enter Password"
									title="Re-enter your new password."
									name="reenterNewPassword"
									fieldSize="medium"
									startValue=""
									textInputType="password"/>
								<MediumInputButton
									form="reset-password-form"
									type="submit"
									className="reset-button"
									value="Reset Password"/>
							</FormStyleContext.Provider>
					</ValidatedForm>
				</>
			: <></>}
		</div>
	);
}
