import { useDispatch } from "react-redux";
import { setCustomThemesWithoutQueue } from "../../../features/theme/themeSlice";
import { useUserAccount } from "../useUserAccount";
import { IWrapperProperties } from "../wrapper";
import { useContext, useEffect } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../../context/video";
import { useDirectoryResource } from "../resources/useDirectoryResource";
import { useVideosResource } from "../resources/useVideosResource";
import { useThemesResource } from "../resources/useThemesResource";
import { disableControlsLock, enableControlsLock } from "../../../features/state/tempStateSlice";

export function AccountDataWrapper({ children }: IWrapperProperties) {
	const { isSignedIn, user } = useUserAccount();
	const { directoryRoot, setCounter, videoData } = useContext<IVideoDirectoryContext>(VideoDirectoryContext);
	const { fetchDirectoryRoot } = useDirectoryResource(isSignedIn ? user : null);
	const { fetchVideos } = useVideosResource(isSignedIn ? user : null);
	const { fetchCustomThemes } = useThemesResource();
	const dispatch = useDispatch();

	useEffect(() => {
		// Account storage.
		const getAccountData = async () => {
			if (!isSignedIn) {
				return;
			}
			
			dispatch(enableControlsLock());

			let retrievedVideos = await fetchVideos();
			let retrievedDirectoryRoot = await fetchDirectoryRoot();
			let retrievedCustomThemes = await fetchCustomThemes();

			if (retrievedVideos == undefined || retrievedDirectoryRoot == undefined || retrievedCustomThemes == undefined) {
				// Should never happen.
				console.error(`Account data missing: ${retrievedVideos}, ${retrievedDirectoryRoot}, ${retrievedCustomThemes}`);
				return;
			}

			dispatch(setCustomThemesWithoutQueue(retrievedCustomThemes));

			retrievedVideos?.forEach(x => videoData.set(x.id, x));
			directoryRoot.subNodes = retrievedDirectoryRoot.subNodes;

			setCounter(Math.random());

			dispatch(disableControlsLock());
		}

		getAccountData();
	}, [isSignedIn ? user.tokens : false]);
	
	return children;
}
