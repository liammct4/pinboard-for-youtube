import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ReactComponent as PfyLogo } from "./../../assets/logo/logo.svg"
import { useNotificationMessage } from "../components/features/notifications/useNotificationMessage";
import { ConnectionEventType, GlobalRequestHandler, NetworkErrorType } from "../lib/util/request";
import { useDispatch } from "react-redux";
import { setAccessAndIDTokens } from "../features/auth/authSlice";
import { regenerateTokensWithRefreshToken } from "../lib/user/accounts";
import { HttpStatusCode } from "../lib/util/http";

export function HomePage(): React.ReactNode {
	const navigate = useNavigate();
	const { activateMessage } = useNotificationMessage();
	const dispatch = useDispatch();
	// Setup offline network handler.
	useEffect(() => {
		
	}, []);

	return (
		<div className="outer-body">
			<div className="header-area">
				<PfyLogo className="extension-logo"/>
				<h1 className="extension-title">Pinboard for YouTube</h1>
				<hr className="bold-separator"></hr>
			</div>
			<div className="inner-body-content">
				<Outlet/>
			</div>
			<div className="footer-area">
				<hr className="bold-separator"></hr>
				<div className="button-options">
					<button className="button-base button-small"
						onClick={() => navigate("menu/options")}>Options</button>
					<button className="button-base button-small"
						onClick={() => navigate("menu/help")}>Help</button>
				</div>
				<h2 className="extension-version">Version 1.0.0</h2>
			</div>
		</div>
	);
}
