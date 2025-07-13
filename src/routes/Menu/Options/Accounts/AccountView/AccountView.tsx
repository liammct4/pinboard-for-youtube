import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUserAccount } from "../../../../../lib/user/accounts";
import { userDetailsFieldData, UserDetailsForm, UserDetailsFormField, UserDetailsFormPrimitive } from "../UserDetailsForm/UserDetailsFormPrimitive";
import { authActions } from "../../../../../features/auth/authSlice";
import { validatePasswordInputField } from "../../../../../lib/user/password";
import { SplitHeading } from "../../../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { FormDialog } from "../../../../../components/dialogs/FormDialog";
import { useNotificationMessage } from "../../../../../components/features/notifications/useNotificationMessage";
import { useUserAccount } from "../../../../../components/features/useUserAccount";
import "./AccountView.css"
import { TextInput } from "../../../../../components/input/TextInput/TextInput";
import { FormField, ValidatorResult } from "../../../../../components/forms/ValidatedForm";
import { SmallButton } from "../../../../../components/interactive/buttons/SmallButton/SmallButton";

type UpdatePasswordFormField = "previousPassword" | "newPassword" | "confirmNewPassword";

const passwordValidator = (data: string, field: UpdatePasswordFormField): ValidatorResult<UpdatePasswordFormField> => {
	let result = validatePasswordInputField(data);

	if (!result.success) {
		return {
			success: false,
			reason: {
				name: field,
				message: result.reason
			}
		};
	}

	return {
		success: true
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
										trigger={<SmallButton>Change</SmallButton>}>
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
										trigger={<SmallButton>Change</SmallButton>}>
											<TextInput<UpdatePasswordFormField>
												name="previousPassword"
												label="Previous Password"
												title="Enter your previous password."
												fieldSize="max"
												startValue=""/>
											<hr className="regular-separator"/>
											<TextInput<UpdatePasswordFormField>
												name="newPassword"
												label="New Password"
												title="Enter your new password."
												fieldSize="max"
												startValue=""/>
											<TextInput<UpdatePasswordFormField>
												name="confirmNewPassword"
												label="Confirm New Password"
												title="Re-enter your new password."
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
								<SmallButton onClick={onSignout}>Sign out</SmallButton>
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
									trigger={<SmallButton>Delete account</SmallButton>}>
										<UserDetailsFormPrimitive showEmail={false}/>
								</FormDialog>
							</li>
						</ul>
					</div>
				</div>
				<SplitHeading text="Actions"/>
				<ul className="actions-list">
					<li>
						<SmallButton>Download your data</SmallButton>
					</li>
				</ul>
			</>
			: <p>Not signed in</p> // Should never be reached...
	);
}
