import { Outlet, useNavigate } from "react-router-dom";
import { registerAccount } from "../../../../../lib/user/accounts";
import { IUserDetailsForm } from "../UserDetailsForm/UserDetailsFormPage";
import { HttpStatusCode } from "../../../../../lib/util/http";
import { HttpResponse } from "../../../../../lib/util/request";
import { startResendVerfiyEmailState } from "../../../../../lib/storage/persistentState/resendVerificationEmail";
import { useNotificationMessage } from "../../../../../components/features/useNotificationMessage";
import "./Register.css"

export function Register(): React.ReactNode {
	const navigate = useNavigate();
	const { activateMessage, cancelCurrentNotification } = useNotificationMessage();

	const onRegisterSubmitted = async (value: IUserDetailsForm) => {
		activateMessage(undefined, "Creating your account, please wait...", "Info", "Info", -1, "Slide");

		let response: HttpResponse | undefined = await registerAccount(value.email, value.password);

		if (response == undefined) {
			return;
		}
		
		if (response.status == HttpStatusCode.OK) {
			navigate("success");
			cancelCurrentNotification();
			startResendVerfiyEmailState({ email: value.email });
		}
	}

	return (
		<div className="register-account-page">
			<h2 className="account-heading">Create an account</h2>
			<hr className="bold-separator"/>
			<Outlet context={{
				onSubmitted: onRegisterSubmitted,
				formName: "register-account-form",
				submitText: "Create account"
			}}/>
		</div>
	);
}
