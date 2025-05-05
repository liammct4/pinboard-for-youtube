import { useDispatch } from "react-redux";
import { themeActions } from "../../../features/theme/themeSlice";
import { useUserAccount } from "../useUserAccount";
import { IWrapperProperties } from "../wrapper";
import { useContext, useEffect } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../../context/video";
import { useDirectoryResource } from "../resources/useDirectoryResource";
import { useVideosResource } from "../resources/useVideosResource";
import { useThemesResource } from "../resources/useThemesResource";
import { tempStateActions } from "../../../features/state/tempStateSlice";
import { videoActions } from "../../../features/video/videoSlice";

export function AccountDataWrapper({ children }: IWrapperProperties) {
	const { isSignedIn, user } = useUserAccount();
	const { directoryRoot, setCounter } = useContext<IVideoDirectoryContext>(VideoDirectoryContext);
	const { fetchDirectoryRoot } = useDirectoryResource();
	const { fetchVideos } = useVideosResource();
	const { fetchCustomThemes } = useThemesResource();
	const dispatch = useDispatch();

	useEffect(() => {
		// Account storage.
		const getAccountData = async () => {
			if (!isSignedIn) {
				return;
			}
			
			dispatch(tempStateActions.enableControlsLock());

			let retrievedVideos = await fetchVideos();
			let retrievedDirectoryRoot = await fetchDirectoryRoot();
			let retrievedCustomThemes = await fetchCustomThemes();

			if (retrievedVideos == undefined || retrievedDirectoryRoot == undefined || retrievedCustomThemes == undefined) {
				// Should never happen.
				console.error(`Account data missing: ${retrievedVideos}, ${retrievedDirectoryRoot}, ${retrievedCustomThemes}`);
				return;
			}

			dispatch(themeActions.setCustomThemesWithoutQueue(retrievedCustomThemes));
			dispatch(videoActions.setVideos(retrievedVideos));

			directoryRoot.subNodes = retrievedDirectoryRoot.subNodes;

			setCounter(Math.random());

			dispatch(tempStateActions.disableControlsLock());
		}

		getAccountData();
	}, [isSignedIn ? user.tokens : false]);
	
	return children;
}
