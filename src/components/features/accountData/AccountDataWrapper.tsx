import { useDispatch } from "react-redux";
import { setCustomThemesWithoutQueue } from "../../../features/theme/themeSlice";
import { IAppTheme } from "../../../lib/config/theming/appTheme";
import { getAccountResourceData } from "../../../lib/user/resource";
import { ITagDefinition, IVideo } from "../../../lib/video/video";
import { useUserAccount } from "../useUserAccount";
import { IWrapperProperties } from "../wrapper";
import { directoriesEndpoint, themesEndpoint, videosEndpoint } from "../../../lib/api/pinboardApi";
import { useContext } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../../context/video";
import { IDirectoryNode } from "../../video/navigation/directory";
import { useServerResourceRequest } from "../useServerResourceRequest";

export function AccountDataWrapper({ children }: IWrapperProperties) {
	const { user, isSignedIn } = useUserAccount();
	const { directoryRoot, counter, setCounter, videoData } = useContext<IVideoDirectoryContext>(VideoDirectoryContext);
	const dispatch = useDispatch();

	// Account storage.
	const getAccountVideos = async () => {
		if (!isSignedIn) {
			return;
		}

		/*
		
		// TODO: Implement hooks for each resource. (i.e. useDirectoryResource)

		let token = user.tokens.IdToken;
		let retrievedVideos = await getAccountResourceData<IVideo>(videosEndpoint, token);
		let retrievedDirectoryRoot = await getAccountResourceData<IDirectoryNode>(directoriesEndpoint, token);
		let retrievedCustomThemes = await getAccountResourceData<IAppTheme>(themesEndpoint, token);

		if (retrievedVideos == undefined || retrievedDirectoryRoot == undefined || retrievedCustomThemes == undefined) {
			// Should never happen.
			console.error(`Account data missing: ${retrievedVideos}, ${retrievedDirectoryRoot}, ${retrievedCustomThemes}`);
			return;
		}

		dispatch(setCustomThemesWithoutQueue(retrievedCustomThemes));

		retrievedVideos?.forEach(x => videoData.set(x.id, x));
		directoryRoot.subNodes = retrievedDirectoryRoot*/
	}

	getAccountVideos();
	
	return children;
}
