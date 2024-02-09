import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationMessage } from "../../../../../../components/features/useNotificationMessage";
import { FormField } from "../../../../../../components/forms/FormField/FormField";
import { IErrorFieldValues, useValidatedForm } from "../../../../../../components/forms/validated-form";
import { FormStyleContext } from "../../../../../../components/input/formStyleContext";
import { confirmResetPassword, startResetPassword } from "../../../../../../lib/user/accounts";
import { IUserDetailsForm } from "../../UserDetailsForm/UserDetailsFormPage";
import { UserDetailsFormPrimitive } from "../../UserDetailsForm/UserDetailsFormPrimitive";
import { HttpResponse } from "../../../../../../lib/util/request";
import { HttpStatusCode } from "../../../../../../lib/util/http";
import { endResetPasswordPersistentState, getResetPasswordPersistentState, setResetPasswordPersistentState, startResetPasswordPersistentState } from "../../../../../../lib/storage/persistentState/resetPassword";
import { TextInputContext } from "../../../../../../components/input/TextInput/TextInput";
import "./ForgotPassword.css"

interface IResetPasswordForm extends IErrorFieldValues {
	verificationCode: string;
	newPassword: string;
	reenterNewPassword: string;
}

//const useRequest

function useEmailSubmit() {
	const { activateMessage } = useNotificationMessage();

	const onEmailSubmit = async (value: IUserDetailsForm) => {
		let response = startResetPassword(value.email);

		if (response?.status == HttpStatusCode.OK) {
			activateMessage(
				undefined,
				"A verification code has been sent to your email address. Please make sure that you check your spam folder.",
				"Info",
				"Info",
				5000
			);
		}

		let state = await getResetPasswordPersistentState();

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

	const onCodePasswordSubmit = async (value: IResetPasswordForm) => {
		let state = await getResetPasswordPersistentState();

		if (state == undefined) {
			activateMessage(undefined, "Please send a verification code first.", "Warning", "Warning", 5000);
			return;
		}

		if (value.newPassword != value.reenterNewPassword) {
			activateMessage(undefined, "Password re-entered did not match.", "Warning", "Warning", 5000);
			return;
		}

		let response: HttpResponse | undefined = confirmResetPassword(state.email, value.newPassword, value.verificationCode);

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
	const enterEmailAddressForm = useValidatedForm<IUserDetailsForm>((data: IUserDetailsForm) => {
		setNewPasswordVisible(true);
		onEmailSubmit(data);
	});
	const enterCodePasswordForm = useValidatedForm<IResetPasswordForm>(onCodePasswordSubmit);

	// Use effects are needed because async functions cannot be used directly in component level.
	useEffect(() => {
		const checkCodeSent = async () => {
			let state = await getResetPasswordPersistentState();
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
			<form onSubmit={enterEmailAddressForm.handleSubmit(enterEmailAddressForm.handler)} id="reset-password-email-form">
				<UserDetailsFormPrimitive
					submit={enterEmailAddressForm.submit.current}
					register={enterEmailAddressForm.register}
					showPassword={false}/>
			</form>
			<input
				form="reset-password-email-form"
				type="submit"
				className="send-reset-email-button button-medium button-base"
				value="Send password reset email"/>
			{newPasswordFormVisible ?
				<>
					<h2 className="verification-text">Please enter the code sent to your email address:</h2>
					<form
						className="reset-password-form"
						id="reset-password-form"
						onSubmit={enterCodePasswordForm.handleSubmit(enterCodePasswordForm.handler)}>
							<FormStyleContext.Provider value={{ labelSize: "large" }}>
								<FormField<IResetPasswordForm>
									label="Verification Code"
									name="verificationCode"
									register={enterCodePasswordForm.register}
									selector={(data: IResetPasswordForm) => data.verificationCode}
									fieldSize="small"
									submitEvent={enterCodePasswordForm.submit.current}
									validationMethod={() => null}/>
								<TextInputContext.Provider value={{ textInputType: "password" }}>
									<FormField<IResetPasswordForm>
										label="New Password"
										name="newPassword"
										register={enterCodePasswordForm.register}
										selector={(data: IResetPasswordForm) => data.verificationCode}
										fieldSize="medium"
										submitEvent={enterCodePasswordForm.submit.current}
										validationMethod={() => null}/>
									<FormField<IResetPasswordForm>
										label="Re-enter Password"
										name="reenterNewPassword"
										register={enterCodePasswordForm.register}
										selector={(data: IResetPasswordForm) => data.verificationCode}
										fieldSize="medium"
										submitEvent={enterCodePasswordForm.submit.current}
										validationMethod={() => null}/>
								</TextInputContext.Provider>
								<input
									form="reset-password-form"
									type="submit"
									className="reset-button button-medium button-base"
									value="Reset Password"/>
							</FormStyleContext.Provider>
					</form>
				</>
			: <></>}
		</div>
	);
}
