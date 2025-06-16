import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeUserEmail, changeUserPassword, deleteUserAccount } from "../../../../../lib/user/accounts";
import { userDetailsFieldData, UserDetailsForm, UserDetailsFormField, UserDetailsFormPrimitive } from "../UserDetailsForm/UserDetailsFormPrimitive";
import { authActions } from "../../../../../features/auth/authSlice";
import { HttpResponse } from "../../../../../lib/util/request";
import { HttpStatusCode } from "../../../../../lib/util/http";
import { validatePasswordInputField } from "../../../../../lib/user/password";
import { SplitHeading } from "../../../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { FormDialog } from "../../../../../components/dialogs/FormDialog";
import { useNotificationMessage } from "../../../../../components/features/notifications/useNotificationMessage";
import { useUserAccount } from "../../../../../components/features/useUserAccount";
import "./AccountView.css"
import { TextInput } from "../../../../../components/input/TextInput/TextInput";
import { FormField, Validator, ValidatorResult } from "../../../../../components/forms/ValidatedForm";

type UpdatePasswordFormField = "previousPassword" | "newPassword" | "confirmNewPassword";
type UpdatePasswordForm = {
	previousPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

function useAccountDelete() {
	const { user, isSignedIn } = useUserAccount();
	const { activateMessage } = useNotificationMessage();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onDeleteSubmit = (value: UserDetailsForm) => {
		activateMessage(undefined, "Deleting your account.", "Info", "Info", -1);

		setTimeout(async () => {
			if (!isSignedIn) {
				return;
			}

			let response: HttpResponse | undefined = await deleteUserAccount(user.email, value.password, user.tokens);

			if (response == undefined) {
				return;
			}

			if (response!.status == HttpStatusCode.OK) {
				activateMessage("Account deleted.", "Your account has been successfully deleted, please log out of any other devices.", "Success", "Tick", 10000);
				dispatch(authActions.logoutCurrentUser());
			}
			else if (response!.status == HttpStatusCode.UNAUTHORIZED) {
				// Meaning token was invalid.
				if (response?.body == "Unauthorized") {
					activateMessage(undefined, "Something went wrong, please log in and try again.", "Error", "Error", 6000, "Shake");
				}
				else {
					activateMessage(undefined, response?.body, "Error", "Error", 4000, "Shake");
				}
			}
			
			navigate("/app/menu/options/accounts");
		}, 10);
	};

	return { onDeleteSubmit }
}

function useEmailChange() {
	const { user, isSignedIn } = useUserAccount();
	const { activateMessage } = useNotificationMessage();

	const onChangeEmailSubmit = (value: UserDetailsForm) => {
		activateMessage(undefined, "Updating your email address...", "Info", "Info", -1);
		
		setTimeout(async () => {
			if (!isSignedIn) {
				return;
			}

			let response: HttpResponse | undefined = await changeUserEmail(user.email, value.email, user.tokens);
			
			if (response == undefined) {
				return;
			}

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
					6000,
					"Shake"
				);
			}
		}, 10);
	}

	return { onChangeEmailSubmit };
}

function usePasswordChange() {
	const { user, isSignedIn } = useUserAccount();
	const { activateMessage } = useNotificationMessage();

	const onChangePasswordSubmit = (value: UpdatePasswordForm) => {
		activateMessage(undefined, "Updating your password...", "Info", "Info", -1);
		
		setTimeout(async () => {
			if (!isSignedIn) {
				return;
			}

			let response: HttpResponse | undefined = await changeUserPassword(
				user.email,
				value.previousPassword,
				value.newPassword,
				user.tokens
			);
			
			if (response == undefined) {
				return undefined;
			}

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
						6000,
						"Shake"
					);
				}
				else {
					activateMessage(
						undefined,
						response.body,
						"Error",
						"Error",
						6000,
						"Shake"
					);
				}
			}
		}, 10);
	}

	return { onChangePasswordSubmit }
}

const passwordValidator = (data: string, field: UpdatePasswordFormField): ValidatorResult<UpdatePasswordFormField> => {
	let result = validatePasswordInputField(data);

	if (result == null) {
		return { error: false };
	}

	return {
		error: true,
		details: {
			name: field,
			message: result
		}
	}
}

const updatePasswordForm: FormField<UpdatePasswordFormField>[] = [
	{
		name: "previousPassword",
		validator: (data) => passwordValidator(data, "previousPassword")
	},
	{
		name: "newPassword",
		validator: (data) => passwordValidator(data, "newPassword")
	},
	{
		name: "confirmNewPassword",
		validator: (data) => passwordValidator(data, "confirmNewPassword")
	}
]

export function AccountView(): React.ReactNode {
	const { user, isSignedIn } = useUserAccount();
	const { activateMessage } = useNotificationMessage();
	const { onDeleteSubmit } = useAccountDelete();
	const { onChangeEmailSubmit } = useEmailChange();
	const { onChangePasswordSubmit } = usePasswordChange();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onSignout = () => {
		dispatch(authActions.logoutCurrentUser());

		activateMessage(undefined, "You have now been logged out.", "Info", "Info", 6500);
		setTimeout(() => {
			navigate("/app/menu/options/accounts");
		}, 10);
	};

	// Because this page is only shown when authenticated. 'currentUser' should never be null, but may be null when deleting/logging out before redirecting.
	return (
		isSignedIn ?
			<>
				<SplitHeading text="Your account details"/>
				<div className="account-details">
					{/* Account Card, with options to change each field (email, password) */}
					<table className="account-card paragraph-regular">
						<tbody>
							{/* Email field. */}
							<tr>
								<td className="account-field-name"><b>Email: </b></td>
								<td className="account-field-value">{user?.email}</td>
								<td>
									<FormDialog<UserDetailsForm, UserDetailsFormField>
										name="change-email-form"
										title="Change Email Address"
										submitText="Change email address"
										labelSize="medium"
										fieldData={userDetailsFieldData}
										trigger={<button className="button-small button-base">Change</button>}>
											<UserDetailsFormPrimitive showPassword={false}/>
									</FormDialog>
								</td>
							</tr>
							{/* Password field. */}
							<tr>
								<td className="account-field-name"><b>Password: </b></td>
								<td className="account-field-value" title="This is not your actual password, so don't worry.">**********</td>
								<td>
									<FormDialog
										name="change-password-form"
										title="Change Password"
										submitText="Change password"
										labelSize="very large"
										fieldData={updatePasswordForm}
										trigger={<button className="button-small button-base">Change</button>}>
											<TextInput<UpdatePasswordFormField>
												name="previousPassword"
												label="Previous Password"
												fieldSize="max"
												startValue=""/>
											<hr className="regular-separator"/>
											<TextInput<UpdatePasswordFormField>
												name="newPassword"
												label="New Password"
												fieldSize="max"
												startValue=""/>
											<TextInput<UpdatePasswordFormField>
												name="confirmNewPassword"
												label="Confirm New Password"
												fieldSize="max"
												startValue=""/>
									</FormDialog>
								</td>
							</tr>
						</tbody>
					</table>
					<div className="details-actions">
						<ul className="details-actions-list">
							<li>
								<button className="button-small button-base" onClick={onSignout}>Sign out</button>
							</li>
						</ul>
						<hr className="bold-separator"/>
						<ul className="details-actions-list">
							<li>
								<FormDialog<UserDetailsForm, UserDetailsFormField>
									submitText="Delete my account"
									description="This action cannot be undone, if you are sure you want to delete your account, please enter your password."
									title="Delete your account"
									labelSize="medium"
									name="delete-account-form"
									fieldData={userDetailsFieldData}
									onSuccess={(data) => deleteUserAccount(user.email, data.password, user.tokens)}
									trigger={<button className="button-small button-base">Delete account</button>}>
										<UserDetailsFormPrimitive showEmail={false}/>
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
			: <p>Not signed in</p> // Should never be reached...
	);
}
