import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAccount } from "../../../../../components/features/useUserAccount";

export function AccountsInfo(): React.ReactNode {
	const navigate = useNavigate();
	const { isSignedIn } = useUserAccount();

	useEffect(() => {
		async function checkRedirectOnLoggedIn() {
			if (isSignedIn) {
				navigate("./account");
			}
		}

		checkRedirectOnLoggedIn();
	}, [])

	return (
		<>
			<p className="paragraph-big account-info-text">
				Create an account to backup and sync your data between devices!
				Every change you make will be saved automatically. With an account,
				you can store and sync saved videos and themes.<br/>
				<br/>
				This is optional however, so you can continue to use
				Pinboard for YouTube without an account and save the data locally. The extension
				will continue to function normally in case of a server outage/connection issue and
				will attempt to resync whenever the connection has been re-established.<br/>
				<br/>
				To get started, click the <b>Create account</b> button below.
				Or alternatively, login with an existing account.
			</p>
			<div className="account-button-option-bar">
				<button
					className="button-base button-large"
					onClick={() => navigate("register")}>Create Account</button>
				<button
					className="button-base button-large"
					onClick={() => navigate("login")}>Login</button>
			</div>
		</>
	);
}
