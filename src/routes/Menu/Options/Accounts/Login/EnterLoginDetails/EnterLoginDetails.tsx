import { IAuthenticatedUser, useLogin } from "../../../../../../lib/user/accounts";
import { useNotificationMessage } from "../../../../../../components/features/useNotificationMessage";
import { Outlet, useNavigate } from "react-router-dom";
import { IUserDetailsForm } from "../../UserDetailsForm/UserDetailsFormPage";

export function EnterLoginDetails(): React.ReactNode {
	const { activateMessage } = useNotificationMessage();
	const { attemptLogin } = useLogin();
	const navigate = useNavigate();

	const onLoginSubmitted = async (value: IUserDetailsForm) => {
		activateMessage(undefined, "Logging you in...", "Info", "Info", -1);
		setTimeout(async () => {
			let newlyAuthenticatedUser: IAuthenticatedUser | undefined = await attemptLogin(value.email, value.password);

			// Leave the offline errors to the offline handler. (In GlobalRequestHandler)
			if (!navigator.onLine) {
				return;
			}

			if (newlyAuthenticatedUser == undefined) {
				activateMessage(undefined, "The username/password entered was incorrect.", "Error", "Error", 5000, "Shake");
				return;
			}

			activateMessage("Success!", "You have now been logged in.", "Success", "Tick", 4000, "Slide");

			setTimeout(() => {
				navigate("/app/menu/options/accounts");
			}, 10);
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
				onClick={() => navigate("/app/menu/options/accounts/login/forgot password")}>Forgot your password?</button>
		</>
	);
}
