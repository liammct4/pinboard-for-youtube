import { Outlet, To, useNavigate } from "react-router-dom";
import { GlobalNotificationContext, IGlobalNotification } from "../components/features/useNotificationMessage";
import { UserAuthContext } from "../context/auth";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect, useRef, useState } from "react";
import { NotificationToast } from "../components/events/NotificationToast";
import * as Toast from "@radix-ui/react-toast";
import { getSavedPath } from "../lib/storage/persistentState/persistentState";
import { SyncTimer } from "../lib/util/generic/timeUtil";
import "./HomePage.css"

export function PfyWrapper(): React.ReactNode {
	const [currentNotification, setCurrentNotification] = useState<IGlobalNotification | undefined>();
	const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
	const { current: notificationExpiryTimer } = useRef<SyncTimer>(new SyncTimer());
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);
	const navigate = useNavigate();

	useEffect(() => {
		if (currentNotification == undefined) {
			return;
		}

		setNotificationOpen(true);

		notificationExpiryTimer.agreedTime = currentNotification.endDate;

		if (currentNotification.endDate == undefined) {
			return;
		}

		const duration = Math.max(0, currentNotification.endDate.getTime() - Date.now());

		// Remove notification after expiry.
		setTimeout(() => {
			cancelNotification();
		}, duration);

	}, [currentNotification]);
	// When the extension initializes, the first thing to check if theres any persistent state and redirect.
	useEffect(() => {
		const checkPersistentState = async () => {
			let path: string | undefined = await getSavedPath();

			if (path != undefined) {
				navigate(path as To)
			}
		}

		checkPersistentState();
	}, []);
	const cancelNotification = () => {
		// Means that this was called by another requested notification, so ignore expiry.
		if (notificationExpiryTimer.agreedTime == undefined || Date.now() < notificationExpiryTimer.agreedTime.getTime()) {
			return;
		}

		setCurrentNotification(undefined);
		setNotificationOpen(false);
	}

	return (
		<UserAuthContext.Provider value={{ currentUser }}>
				<GlobalNotificationContext.Provider value={{
					currentNotification: currentNotification,
					setGlobalNotification: setCurrentNotification,
					cancelCurrentNotification: () => {
						setCurrentNotification(undefined);
						setNotificationOpen(false);
					}
				}}>
					<div className="pfy-style-context" style={{ height: "100%" }}>
						<Toast.Provider>
							<NotificationToast
								isOpen={notificationOpen}
								title={currentNotification?.title ?? ""}
								message={currentNotification?.message ?? ""}
								colour={currentNotification?.colour ?? "Info"}
								image={currentNotification?.image ?? "Info"}
								animationType={currentNotification?.animation ?? "Slide"}/>
						</Toast.Provider>
						<Outlet/>
					</div>
				</GlobalNotificationContext.Provider>
		</UserAuthContext.Provider>
	)
}
