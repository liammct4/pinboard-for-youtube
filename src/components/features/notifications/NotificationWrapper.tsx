import * as Toast from "@radix-ui/react-toast";
import { GlobalNotificationContext, IGlobalNotification } from "./useNotificationMessage";
import { NotificationToast } from "../../events/NotificationToast";
import { useEffect, useRef, useState } from "react";
import { SyncTimer } from "../../../lib/util/generic/timeUtil";
import { IWrapperProperties } from "../wrapper";

export function NotificationWrapper({ children }: IWrapperProperties) {
	const [currentNotification, setCurrentNotification] = useState<IGlobalNotification | undefined>();
	const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
	const { current: notificationExpiryTimer } = useRef<SyncTimer>(new SyncTimer());

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

	const cancelNotification = () => {
		// Means that this was called by another requested notification, so ignore expiry.
		if (notificationExpiryTimer.agreedTime == undefined || Date.now() < notificationExpiryTimer.agreedTime.getTime()) {
			return;
		}

		setCurrentNotification(undefined);
		setNotificationOpen(false);
	}

	return (
		<GlobalNotificationContext.Provider value={{
			currentNotification: currentNotification,
			setGlobalNotification: setCurrentNotification,
			cancelCurrentNotification: () => {
				setCurrentNotification(undefined);
				setNotificationOpen(false);
			}
		}}>
			<Toast.Provider>
				<NotificationToast
					isOpen={notificationOpen}
					title={currentNotification?.title ?? ""}
					message={currentNotification?.message ?? ""}
					colour={currentNotification?.colour ?? "Blank"}
					image={currentNotification?.image ?? "None"}
					animationType={currentNotification?.animation ?? "Slide"}/>
			</Toast.Provider>
			{children}
		</GlobalNotificationContext.Provider>
	)
}
