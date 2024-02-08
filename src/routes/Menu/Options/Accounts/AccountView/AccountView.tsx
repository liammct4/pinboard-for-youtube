import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNotificationMessage } from "../../../../../components/features/useNotificationMessage";
import { useValidatedForm } from "../../../../../components/forms/validated-form";
import { IUserAuthContext, UserAuthContext } from "../../../../../context/auth";
import { UserDetailsFormPrimitive } from "../UserDetailsForm/UserDetailsFormPrimitive";
import { logoutCurrentUser } from "../../../../../features/auth/authSlice";
import { IUserDetailsForm } from "../UserDetailsForm/UserDetailsFormPage";
import { deleteUserAccount } from "../../../../../lib/user/accounts";
import { HttpResponse } from "../../../../../lib/util/request";
import { HttpStatusCode } from "../../../../../lib/util/http";
import SplitHeading from "../../../../../components/presentation/SplitHeading/SplitHeading";
import FormDialog from "../../../../../components/dialogs/FormDialog";
import "./AccountView.css"

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

export function AccountView(): React.ReactNode {
	const { currentUser } = useContext<IUserAuthContext>(UserAuthContext);
	const { onDeleteSubmit } = useAccountDelete();
	const { register, submit, handleSubmit, handler } = useValidatedForm<IUserDetailsForm>(onDeleteSubmit);

	// Because this page is only shown when authenticated. 'currentUser' should never be null, but may be null when deleting/logging out before redirecting.
	return (
		<>
			<SplitHeading text="Your account details"/>
			<div className="account-details">
				<span className="paragraph-regular"><b>Email: </b>{currentUser?.email}</span>
				<ul className="details-actions-list">
					<li>
						<button className="button-small button-base">Sign out</button>
					</li>
					<li>
						<button className="button-small button-base">Change details</button>
					</li>
					<li>
						<FormDialog
							submitText="Delete my account"
							description="This action cannot be undone, if you are sure you want to delete your account, please enter your password."
							handleSubmit={handleSubmit(handler)}
							formTitle="Delete your account"
							labelSize="medium"
							formID="delete-account-form"
							trigger={<button className="button-small button-base">Delete account</button>}>
							<UserDetailsFormPrimitive register={register} submit={submit.current} showEmail={false}/>
						</FormDialog>
					</li>
				</ul>
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
