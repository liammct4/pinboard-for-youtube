import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAccount } from "../../../../../components/features/useUserAccount";
import { useNotificationMessage } from "../../../../../components/features/notifications/useNotificationMessage";
import { ButtonPanel } from "../../../../../components/interactive/ButtonPanel/ButtonPanel";
import { LargeButton } from "../../../../../components/interactive/buttons/LargeButton/LargeButton";

export function AccountsInfo(): React.ReactNode {
	const navigate = useNavigate();
	const { isSignedIn } = useUserAccount();
	const { activateMessage } = useNotificationMessage();

	useEffect(() => {
		activateMessage(undefined, "Unfortunately, accounts are not available currently.", "Warning", "Warning", undefined, "Shake");

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
			<ButtonPanel className="account-button-option-bar">
				<LargeButton disabled onClick={() => navigate("register")}>Create Account</LargeButton>
				<LargeButton disabled onClick={() => navigate("login")}>Login</LargeButton>
			</ButtonPanel>
		</>
	);
}
