import { Outlet, useNavigate } from "react-router-dom";
import { IUserDetailsForm } from "../UserDetailsForm/UserDetailsForm";
import { AuthenticationError, loginSaveUser } from "../../../../../lib/user/accounts";
import { useNotificationMessage } from "../../../../../components/features/useNotificationMessage";
import "./Login.css"

export function Login(): React.ReactNode {
	const { activateMessage, cancelMessage } = useNotificationMessage();
	const navigate = useNavigate();

	const onLoginSubmitted = async (value: IUserDetailsForm) => {
		activateMessage(undefined, "Logging you in...", "Info", "Info", -1);
		setTimeout(async () => {
			try {
				await loginSaveUser(value.email, value.password);

				// Cancel the previous "logging you in..." message.
				cancelMessage();
				
				// Successful
				activateMessage("Success!", "You have now been logged in.", "Success", "Tick", 4000, "Slide");

				setTimeout(() => {
					navigate("/videos");
				}, 4000);
			}
			catch (error) {
				// Don't suppress other errors. Only when not authenticated.
				if (!(error instanceof AuthenticationError)) {
					throw error;
				}
				
				// TODO: Create external handler for error states from requests.
				activateMessage(undefined, "The username/password entered was incorrect.", "Error", "Error", 5000, "Shake");
			}
		}, 200);
	}

	return (
		<div className="account-login-page">
			<Outlet context={{
				onSubmitted: onLoginSubmitted,
				formName: "account-login-form",
				submitText: "Login"
			}}/>
		</div>
	);
}
