import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, IAuthSlice, setCurrentUser } from "./authSlice.ts";
import { userIsLoggedIn } from "../../lib/user/accounts.ts";
import { getAccountResourceData } from "../../lib/user/data/resource.ts";
import { setTagDefinitionsWithoutQueue, setVideosWithoutQueue } from "../videos/videoSlice.ts";
import { getCurrentAuthenticatedUser } from "../../lib/user/storage.ts";
import { disableControlsLock, enableControlsLock } from "../state/tempStateSlice.ts";
import { ITagDefinition, IVideo } from "../../lib/video/video.ts";
import { IAppTheme } from "../../lib/config/theming/appTheme.ts";
import { setCustomThemesWithoutQueue } from "../theme/themeSlice.ts";

export const authAccountDataMiddleware = createListenerMiddleware();

authAccountDataMiddleware.startListening({
	matcher: isAnyOf(setCurrentUserAndStorage, setCurrentUser),
	effect: (_action, listenerApi) => {
		setTimeout(async () => {
			if (!await userIsLoggedIn()) {
				return;
			}

			listenerApi.dispatch(enableControlsLock());

			let currentUser = await getCurrentAuthenticatedUser();
			let token = currentUser!.tokens.IdToken;

			let retrievedVideos: IVideo[] | undefined = await getAccountResourceData<IVideo>("VIDEO", token);
			let retrievedTagDefinitions: ITagDefinition[] | undefined = await getAccountResourceData<ITagDefinition>("TAG", token);
			let retrievedCustomThemes: IAppTheme[] | undefined = await getAccountResourceData<IAppTheme>("THEME", token);

			listenerApi.dispatch(disableControlsLock());
	
			if (retrievedVideos == undefined || retrievedTagDefinitions == undefined || retrievedCustomThemes == undefined) {
				return;
			}
	
			listenerApi.dispatch(setVideosWithoutQueue(retrievedVideos));
			listenerApi.dispatch(setTagDefinitionsWithoutQueue(retrievedTagDefinitions));
			listenerApi.dispatch(setCustomThemesWithoutQueue(retrievedCustomThemes));
		}, 10);
	}
});
