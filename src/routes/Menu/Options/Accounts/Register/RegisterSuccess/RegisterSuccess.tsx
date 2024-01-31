import { useNavigate } from "react-router-dom";
import { IconContainer } from "../../../../../../components/images/svgAsset";
import { ReactComponent as CrossIcon } from "./../../../../../../../assets/symbols/cross.svg" 
import "./RegisterSuccess.css"

export function RegisterSuccess(): React.ReactNode {
	const navigate = useNavigate();
	const onResendVerification = () => {
		// TODO
	};

	return (
		<>
			<div className="title-area">
				<h4 className="register-success-title">Your account has been successfuly created!</h4>
				<button className="button-small circle-button" onClick={() => navigate("../..")} title="Exit to the account page">
					<IconContainer className="icon-colour-standard" asset={CrossIcon} use-stroke/>
				</button>
			</div>
			<p className="paragraph-regular">
				Please verify your email address. If you haven't recieved an email, please
				click the link to <button className="embedded-link-button link-text" onClick={onResendVerification}>resend</button> an email.<br/>
				<br/>
				Once you have verified your account, please use the login button.<br/>
				<br/>
				<i>
					Please note that unverified user accounts will be deleted automatically after 2 days.
					If you have not been able to verify an account in this time, please wait 2 days and then
					register an account again.
				</i>
			</p>
		</>
	);
}
