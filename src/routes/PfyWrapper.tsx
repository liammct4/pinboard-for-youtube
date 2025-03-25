import { Outlet, To, useLocation, useNavigate } from "react-router-dom";
import { GlobalNotificationContext, IGlobalNotification } from "../components/features/useNotificationMessage";
import { UserAuthContext } from "../context/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect, useRef, useState } from "react";
import { NotificationToast } from "../components/events/NotificationToast";
import * as Toast from "@radix-ui/react-toast";
import { getSavedPath } from "../lib/storage/persistentState/persistentState";
import { SyncTimer } from "../lib/util/generic/timeUtil";
import { userIsLoggedIn } from "../lib/user/accounts";
import { getAccountResourceData } from "../lib/user/data/resource.ts";
import { ITagDefinition, IVideo } from "../lib/video/video.ts";
import { IAppTheme } from "../lib/config/theming/appTheme.ts";
import { setCustomThemesWithoutQueue } from "../features/theme/themeSlice.ts";
import "./HomePage.css"
import "./PfyWrapper.css"
import { LocalStorageContext, StorageWrapper } from "../components/features/storage/StorageWrapper.tsx";

export function PfyWrapper(): React.ReactNode {
	const [currentNotification, setCurrentNotification] = useState<IGlobalNotification | undefined>();
	const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
	const { current: notificationExpiryTimer } = useRef<SyncTimer>(new SyncTimer());
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);
	const dispatch = useDispatch();
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
	const location = useLocation();
	// When the extension initializes, the first thing to check if theres any persistent state and redirect.
	// There also needs to be a check to retrieve the videos from account storage.
	useEffect(() => {
		// Persistent state.
		const checkPersistentState = async () => {
			let path: string | undefined = await getSavedPath();

			if (path != undefined) {
				navigate(path as To)
			}
		}

		checkPersistentState();

		// Account storage.
		const getAccountVideos = async () => {
			if (!await userIsLoggedIn()) {
				return;
			}

			let token = currentUser!.tokens.IdToken;
			let retrievedVideos = await getAccountResourceData<IVideo>("VIDEO", token);
			let retrievedTagDefinitions = await getAccountResourceData<ITagDefinition>("TAG", token);
			let retrievedCustomThemes = await getAccountResourceData<IAppTheme>("THEME", token);

			if (retrievedCustomThemes != undefined) {
				dispatch(setCustomThemesWithoutQueue(retrievedCustomThemes));
			}
		}

		getAccountVideos();
	}, []);
	useEffect(() => {
		// If the current page needs to expand the extension to fit properly.
		let paths = [
			"/app/menu/options/accounts/conflicts" // TODO...
		]

		if (paths.includes(location.pathname)) {
			setExpanded(true);
		}
		else {
			setExpanded(false);
		}
	}, [location]);
	const [expanded, setExpanded] = useState<boolean>();
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
			<StorageWrapper>
				<GlobalNotificationContext.Provider value={{
					currentNotification: currentNotification,
					setGlobalNotification: setCurrentNotification,
					cancelCurrentNotification: () => {
						setCurrentNotification(undefined);
						setNotificationOpen(false);
					}
				}}>
					<div className="pfy-style-context extension-bounds" data-expanded-window={expanded}>
						<Toast.Provider>
							<NotificationToast
								isOpen={notificationOpen}
								title={currentNotification?.title ?? ""}
								message={currentNotification?.message ?? ""}
								colour={currentNotification?.colour ?? "Blank"}
								image={currentNotification?.image ?? "None"}
								animationType={currentNotification?.animation ?? "Slide"}/>
						</Toast.Provider>
						<Outlet/>
					</div>
				</GlobalNotificationContext.Provider>
			</StorageWrapper>
		</UserAuthContext.Provider>
	)
}
