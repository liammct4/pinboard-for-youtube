/// <reference types="vite-plugin-svgr/client" />

import { useNavigate } from "react-router-dom";
import { IconContainer } from "../../../../../../components/images/svgAsset";
import CrossIcon from "./../../../../../../../assets/symbols/cross.svg?react"
import { useNotificationMessage } from "../../../../../../components/features/notifications/useNotificationMessage";
import { resendEmailVerificationLink } from "../../../../../../lib/user/accounts";
import { endResendVerfiyEmailState } from "../../../../../../lib/storage/persistentState/resendVerificationEmail";
import { HttpStatusCode } from "../../../../../../lib/util/http";
import "./RegisterSuccess.css"
import { useLocalStorage } from "../../../../../../components/features/storage/useLocalStorage";

export function RegisterSuccess(): React.ReactNode {
	const navigate = useNavigate();
	const { activateMessage } = useNotificationMessage();
	const { storage } = useLocalStorage();
	const onResendVerification = async () => {
		let state = storage.persistentState.resendVerificationEmailState;

		// Should only happen if another persistent state is activated.
		if (state == undefined) {
			activateMessage(undefined, "That action is not allowed.", "Error", "Error", 7000, "Shake");
			return;
		}

		activateMessage(undefined, "Sending...", "Info", "Info", -1, "Slide");

		var response = await resendEmailVerificationLink(state.email);

		if (response?.status == HttpStatusCode.OK) {
			activateMessage(undefined, "A new verification email has been sent, please check your inbox.", "Info", "Info", 7000, "Slide");
		}
		else {
			activateMessage(undefined, "Something unexpected has occurred, please try again later.", "Error", "Error", 7000, "Shake");
		}
	};
	const cancelVerificationPage = () => {
		endResendVerfiyEmailState();
		navigate("../..");
	};

	return (
		<>
			<div className="title-area">
				<h4 className="register-success-title">Your account has been successfuly created!</h4>
				<button className="button-small circle-button" onClick={cancelVerificationPage} title="Exit to the account page">
					<IconContainer className="icon-colour-standard" asset={CrossIcon} use-stroke/>
				</button>
			</div>
			<p className="paragraph-regular">
				Please verify your email address. If you haven't recieved an email, please
				click the link to <button className="embedded-link-button link-text" onClick={onResendVerification}>resend</button> an email.<br/>
				<br/>
				Once you have verified your account, please use the login button.<br/>
				<br/>
				<i>Please note, if you accidentally close out of this page, and you still do not have a verification email, recreate your account.</i>
			</p>
		</>
	);
}
