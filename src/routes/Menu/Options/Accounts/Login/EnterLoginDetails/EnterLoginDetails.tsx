import { Outlet, useNavigate } from "react-router-dom";
import { IUserDetailsForm } from "../../UserDetailsForm/UserDetailsFormPage";
import { AuthenticationError, useLogin } from "../../../../../../lib/user/accounts";
import { useNotificationMessage } from "../../../../../../components/features/useNotificationMessage";

export function EnterLoginDetails(): React.ReactNode {
	const { activateMessage, cancelMessage } = useNotificationMessage();
	const { attemptLogin } = useLogin();
	const navigate = useNavigate();

	const onLoginSubmitted = async (value: IUserDetailsForm) => {
		activateMessage(undefined, "Logging you in...", "Info", "Info", -1);
		setTimeout(async () => {
			try {
				await attemptLogin(value.email, value.password);

				// Cancel the previous "logging you in..." message.
				cancelMessage();
				activateMessage("Success!", "You have now been logged in.", "Success", "Tick", 4000, "Slide");

				setTimeout(() => {
					navigate("/menu/options/accounts");
				}, 10);
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
		<>
			<Outlet context={{
				onSubmitted: onLoginSubmitted,
				formName: "account-login-form",
				submitText: "Login"
			}}/>
			<button
				className="forgot-password-text link-text embedded-link-button"
				onClick={() => navigate("/menu/options/accounts/login/forgot password")}>Forgot your password?</button>
		</>
	);
}
