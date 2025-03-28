import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { To, useNavigate } from "react-router-dom";
import { getAccountResourceData } from "../../../lib/user/data/resource";
import { ITagDefinition, IVideo } from "../../../lib/video/video";
import { IAppTheme } from "../../../lib/config/theming/appTheme";
import { setCustomThemesWithoutQueue } from "../../../features/theme/themeSlice";
import { useAccountInfo } from "../useAccountInfo";
import { useLocalStorage } from "../storage/useLocalStorage";

export interface IPersistentStateWrapperProperties {
	children: JSX.Element | JSX.Element[];
}

export function PersistentStateWrapper({ children }: IPersistentStateWrapperProperties) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, isSignedIn } = useAccountInfo();
	const { storage } = useLocalStorage();

	// When the extension initializes, the first thing to check if theres any persistent state and redirect.
	// There also needs to be a check to retrieve the videos from account storage.
	useEffect(() => {
		// Persistent state.
		const checkPersistentState = async () => {
			let path: string | undefined = storage.persistentState.path;

			if (path != undefined) {
				navigate(path as To)
			}
		}

		checkPersistentState();

		// Account storage.
		const getAccountVideos = async () => {
			if (!isSignedIn) {
				return;
			}

			let token = user.tokens.IdToken;
			let retrievedVideos = await getAccountResourceData<IVideo>("VIDEO", token);
			let retrievedTagDefinitions = await getAccountResourceData<ITagDefinition>("TAG", token);
			let retrievedCustomThemes = await getAccountResourceData<IAppTheme>("THEME", token);

			if (retrievedCustomThemes != undefined) {
				dispatch(setCustomThemesWithoutQueue(retrievedCustomThemes));
			}
		}

		getAccountVideos();
	}, []);

	return children;
}
