import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, IAuthSlice, setCurrentUser } from "./authSlice.ts";
import { disableControlsLock, enableControlsLock } from "../state/tempStateSlice.ts";
import { ITagDefinition, IVideo } from "../../lib/video/video.ts";
import { IAppTheme } from "../../lib/config/theming/appTheme.ts";
import { setCustomThemesWithoutQueue } from "../theme/themeSlice.ts";
import { accessStorage } from "../../lib/storage/storage.ts";
import { getAccountResourceData } from "../../lib/user/resource.ts";

export const authAccountDataMiddleware = createListenerMiddleware();

authAccountDataMiddleware.startListening({
	matcher: isAnyOf(setCurrentUserAndStorage, setCurrentUser),
	effect: (_action, listenerApi) => {
		setTimeout(async () => {
			let storage = await accessStorage();
			let currentUser = storage.auth.currentUser;

			if (currentUser == undefined) {
				return;
			}

			listenerApi.dispatch(enableControlsLock());

			let token = currentUser!.tokens.IdToken;

			let retrievedVideos: IVideo[] | undefined = await getAccountResourceData<IVideo>("VIDEO", token);
			let retrievedTagDefinitions: ITagDefinition[] | undefined = await getAccountResourceData<ITagDefinition>("TAG", token);
			let retrievedCustomThemes: IAppTheme[] | undefined = await getAccountResourceData<IAppTheme>("THEME", token);

			listenerApi.dispatch(disableControlsLock());
	
			if (retrievedVideos == undefined || retrievedTagDefinitions == undefined || retrievedCustomThemes == undefined) {
				return;
			}
	
			listenerApi.dispatch(setCustomThemesWithoutQueue(retrievedCustomThemes));
		}, 10);
	}
});
