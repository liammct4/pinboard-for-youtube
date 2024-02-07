import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ReactComponent as PfyLogo } from "./../../assets/logo/logo.svg"
import { GlobalNotificationContext, IGlobalNotification, useNotificationMessage } from "../components/features/useNotificationMessage";
import * as Toast from "@radix-ui/react-toast"
import { NotificationToast } from "../components/events/NotificationToast";
import "./HomePage.css"

export function HomePage(): React.ReactNode {
	const navigate = useNavigate();
	const [currentNotification, setCurrentNotification] = useState<IGlobalNotification | undefined>();
	const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
	useEffect(() => {
		if (currentNotification == undefined) {
			return;
		}

		setNotificationOpen(true);

		if (currentNotification.endDate == undefined) {
			return;
		}

		const duration = Math.max(0, currentNotification.endDate.getTime() - Date.now());

		// Remove notification after expiry.
		setTimeout(() => {
			cancelNotification();
		}, duration);

	}, [currentNotification]);
	const cancelNotification = () => {
		setCurrentNotification(undefined);
		setNotificationOpen(false);
	}

	return (
		<div className="pfy-style-context outer-body">
			<GlobalNotificationContext.Provider value={{
					currentNotification: currentNotification,
					setGlobalNotification: setCurrentNotification,
					cancelNotification: cancelNotification
				}}>
				<Toast.Provider>
					<NotificationToast
						isOpen={notificationOpen}
						title={currentNotification?.title ?? ""}
						message={currentNotification?.message ?? ""}
						colour={currentNotification?.colour ?? "Info"}
						image={currentNotification?.image ?? "Info"}
						animationType={currentNotification?.animation ?? "Slide"}/>
				</Toast.Provider>
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
			</GlobalNotificationContext.Provider>
		</div>
	);
}

export default HomePage;
