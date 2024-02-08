import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNotificationMessage } from "../../../../../components/features/useNotificationMessage";
import { IErrorFieldValues, useValidatedForm } from "../../../../../components/forms/validated-form";
import { changeUserEmail, changeUserPassword, deleteUserAccount } from "../../../../../lib/user/accounts";
import { IUserAuthContext, UserAuthContext } from "../../../../../context/auth";
import { UserDetailsFormPrimitive } from "../UserDetailsForm/UserDetailsFormPrimitive";
import { logoutCurrentUser } from "../../../../../features/auth/authSlice";
import { IUserDetailsForm } from "../UserDetailsForm/UserDetailsFormPage";
import { HttpResponse } from "../../../../../lib/util/request";
import { HttpStatusCode } from "../../../../../lib/util/http";
import { FormField } from "../../../../../components/forms/FormField/FormField";
import { validatePasswordInputField } from "../../../../../lib/user/details/password";
import SplitHeading from "../../../../../components/presentation/SplitHeading/SplitHeading";
import FormDialog from "../../../../../components/dialogs/FormDialog";
import "./AccountView.css"

interface IUpdatePasswordForm extends IErrorFieldValues {
	previousPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

function useAccountDelete() {
	const { currentUser } = useContext<IUserAuthContext>(UserAuthContext);
	const { activateMessage, cancelMessage } = useNotificationMessage();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onDeleteSubmit = (value: IUserDetailsForm) => {
		activateMessage(undefined, "Deleting your account.", "Info", "Info", -1);

		setTimeout(() => {
			let response: HttpResponse | undefined = deleteUserAccount(currentUser!.email, value.password, currentUser!.tokens);
			
			cancelMessage();
			
			if (response!.status == HttpStatusCode.OK) {
				activateMessage("Account deleted.", "Your account has been successfully deleted, please log out of any other devices.", "Success", "Tick", 10000);
				dispatch(logoutCurrentUser());
			}
			else if (response!.status == HttpStatusCode.UNAUTHORIZED) {
				// Meaning token was invalid.
				if (response?.body == "Unauthorized") {
					activateMessage(undefined, "Something went wrong, please log in and try again.", "Error", "Error", 6000);
				}
				else {
					activateMessage(undefined, response?.body, "Error", "Error", 4000);
				}
			}
			
			navigate("/menu/options/accounts");
		}, 10);
	};

	return { onDeleteSubmit }
}

function useEmailChange() {
	const { currentUser } = useContext<IUserAuthContext>(UserAuthContext);
	const { activateMessage, cancelMessage } = useNotificationMessage();

	const onChangeEmailSubmit = (value: IUserDetailsForm) => {
		activateMessage(undefined, "Updating your email address...", "Info", "Info", -1);
		
		setTimeout(() => {
			let response: HttpResponse | undefined = changeUserEmail(currentUser!.email, value!.email, currentUser!.tokens);
			cancelMessage();

			if (response?.status == HttpStatusCode.OK) {
				activateMessage(
					"Email address updated",
					`Your email address has been successfully changed to ${value.email}`,
					"Success",
					"Tick",
					-1
				);
			}
			else if (response?.status == HttpStatusCode.UNAUTHORIZED) {
				activateMessage(
					undefined,
					"Something went wrong, please try again later.",
					"Error",
					"Error",
					6000
				);
			}
		}, 10);
	}

	return { onChangeEmailSubmit };
}

function usePasswordChange() {
	const { currentUser } = useContext<IUserAuthContext>(UserAuthContext);
	const { activateMessage, cancelMessage } = useNotificationMessage();

	const onChangePasswordSubmit = (value: IUpdatePasswordForm) => {
		activateMessage(undefined, "Updating your password...", "Info", "Info", -1);
		
		setTimeout(() => {
			let response: HttpResponse | undefined = changeUserPassword(
				currentUser!.email,
				value.previousPassword,
				value.newPassword,
				currentUser!.tokens
			);
			cancelMessage();

			if (response?.status == HttpStatusCode.OK) {
				activateMessage(
					"Password successfully updated",
					"Your password has been successfully updated.",
					"Success",
					"Tick",
					4000
				);
			}
			else if (response?.status == HttpStatusCode.UNAUTHORIZED) {
				if (response.body == "Unauthorized.") {
					activateMessage(
						undefined,
						"Something went wrong, please login and try again.",
						"Error",
						"Error",
						6000
					);
				}
				else {
					activateMessage(
						undefined,
						response.body,
						"Error",
						"Error",
						6000
					);
				}
			}
		}, 10);
	}

	return { onChangePasswordSubmit }
}

export function AccountView(): React.ReactNode {
	const { currentUser } = useContext<IUserAuthContext>(UserAuthContext);
	const { onDeleteSubmit } = useAccountDelete();
	const { onChangeEmailSubmit } = useEmailChange();
	const { onChangePasswordSubmit } = usePasswordChange();
	const deleteForm = useValidatedForm<IUserDetailsForm>(onDeleteSubmit);
	const changeEmailForm = useValidatedForm<IUserDetailsForm>(onChangeEmailSubmit);
	const changePasswordForm = useValidatedForm<IUpdatePasswordForm>(onChangePasswordSubmit);

	// Because this page is only shown when authenticated. 'currentUser' should never be null, but may be null when deleting/logging out before redirecting.
	return (
		<>
			<SplitHeading text="Your account details"/>
			<div className="account-details">
				{/* Account Card, with options to change each field (email, password) */}
				<table className="account-card paragraph-regular">
					<tbody>
						{/* Email field. */}
						<tr>
							<td className="account-field-name"><b>Email: </b></td>
							<td className="account-field-value">{currentUser?.email}</td>
							<td>
								<FormDialog
									formID="change-email-form"
									formTitle="Change Email Address"
									submitText="Change email address"
									labelSize="medium"
									handleSubmit={changeEmailForm.handleSubmit(changeEmailForm.handler)}
									trigger={<button className="button-small button-base">Change</button>}>
										<UserDetailsFormPrimitive register={changeEmailForm.register} submit={changeEmailForm.submit.current} showPassword={false}/>
								</FormDialog>
							</td>
						</tr>
						{/* Password field. */}
						<tr>
							<td className="account-field-name"><b>Password: </b></td>
							<td className="account-field-value">**********</td>
							<td>
								<FormDialog
									formID="change-password-form"
									formTitle="Change Password"
									submitText="Change password"
									labelSize="very large"
									handleSubmit={changePasswordForm.handleSubmit(changePasswordForm.handler)}
									trigger={<button className="button-small button-base">Change</button>}>
										<FormField<IUpdatePasswordForm>
											name="previousPassword"
											label="Previous Password"
											fieldSize="max"
											register={changePasswordForm.register}
											selector={(data: IUpdatePasswordForm) => data.previousPassword}
											submitEvent={changePasswordForm.submit.current}
											validationMethod={validatePasswordInputField}/>
										<hr className="regular-separator"/>
										<FormField<IUpdatePasswordForm>
											name="newPassword"
											label="New Password"
											fieldSize="max"
											register={changePasswordForm.register}
											selector={(data: IUpdatePasswordForm) => data.previousPassword}
											submitEvent={changePasswordForm.submit.current}
											validationMethod={validatePasswordInputField}/>
										<FormField<IUpdatePasswordForm>
											name="confirmNewPassword"
											label="Confirm New Password"
											fieldSize="max"
											register={changePasswordForm.register}
											selector={(data: IUpdatePasswordForm) => data.previousPassword}
											submitEvent={changePasswordForm.submit.current}
											validationMethod={validatePasswordInputField}/>
								</FormDialog>
							</td>
						</tr>
					</tbody>
				</table>
				<div className="details-actions">
					<ul className="details-actions-list">
						<li>
							<button className="button-small button-base">Sign out</button>
						</li>
					</ul>
					<hr className="bold-separator"/>
					<ul className="details-actions-list">
						<li>
							<FormDialog
								submitText="Delete my account"
								description="This action cannot be undone, if you are sure you want to delete your account, please enter your password."
								handleSubmit={deleteForm.handleSubmit(deleteForm.handler)}
								formTitle="Delete your account"
								labelSize="medium"
								formID="delete-account-form"
								trigger={<button className="button-small button-base">Delete account</button>}>
									<UserDetailsFormPrimitive register={deleteForm.register} submit={deleteForm.submit.current} showEmail={false}/>
							</FormDialog>
						</li>
					</ul>
				</div>
			</div>
			<SplitHeading text="Actions"/>
			<ul className="actions-list">
				<li>
					<button className="button-small button-base">Download your data</button>
				</li>
			</ul>
		</>
	);
}
