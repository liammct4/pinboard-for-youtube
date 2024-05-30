import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, IAuthSlice, setCurrentUser } from "./authSlice.ts";
import { userIsLoggedIn } from "../../lib/user/accounts.ts";
import { getAccountResourceData } from "../../lib/user/data/resource.ts";
import { setTagDefinitionsWithoutQueue, setVideosWithoutQueue } from "../videos/videoSlice.ts";
import { getCurrentAuthenticatedUser } from "../../lib/user/storage.ts";
import { disableControlsLock, enableControlsLock } from "../state/tempStateSlice.ts";
import { TagDefinition, Video } from "../../lib/video/video.ts";
import { AppTheme } from "../../lib/config/theming/appTheme.ts";
import { setCustomThemesWithoutQueue } from "../theme/themeSlice.ts";

const authAccountDataMiddleware = createListenerMiddleware();

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

			let retrievedVideos: Video[] | undefined = await getAccountResourceData<Video>("VIDEO", token);
			let retrievedTagDefinitions: TagDefinition[] | undefined = await getAccountResourceData<TagDefinition>("TAG", token);
			let retrievedCustomThemes: AppTheme[] | undefined = await getAccountResourceData<AppTheme>("THEME", token);

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

export default { authAccountDataMiddleware };
