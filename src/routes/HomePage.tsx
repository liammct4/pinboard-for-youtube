import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ReactComponent as PfyLogo } from "./../../assets/logo/logo.svg"
import { useNotificationMessage } from "../components/features/useNotificationMessage";
import { GlobalRequestHandler, NetworkErrorType } from "../lib/util/request";

export function HomePage(): React.ReactNode {
	const navigate = useNavigate();
	const { activateMessage } = useNotificationMessage();
	// Setup offline network handler.
	useEffect(() => {
		// Setup handler.
		GlobalRequestHandler.offlineHandler = (type: NetworkErrorType) => {
			let error: string;
			
			switch (type) {
				case "NoConnection":
					error = "You appear to be offline, please check your internet connection.";
					break;
				case "TimedOut":
					error = "There was a problem reaching the server, please try again later.";
					break;
			}

			setTimeout(() => activateMessage(
				type == "TimedOut" ? "Something went wrong" : undefined,
				error,
				"Error",
				"InternetGlobe",
				-1), 100);
			console.log()
		}
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

export default HomePage;
