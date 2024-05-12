import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, IAuthSlice, setCurrentUser } from "./authSlice.ts";
import { userIsLoggedIn } from "../../lib/user/accounts.ts";
import { getAccountCloudVideos } from "../../lib/user/data/videos.ts";
import { setTagDefinitionsWithoutQueue, setVideosWithoutQueue } from "../videos/videoSlice.ts";
import { getCurrentAuthenticatedUser } from "../../lib/user/storage.ts";
import { disableControlsLock, enableControlsLock } from "../state/tempStateSlice.ts";
import { TagDefinition, Video } from "../../lib/video/video.ts";
import { getAccountCloudTags } from "../../lib/user/data/tags.ts";

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
			let retrievedVideos: Video[] | undefined = await getAccountCloudVideos(currentUser!.tokens.IdToken);
			let retrievedTagDefinitions: TagDefinition[] | undefined = await getAccountCloudTags(currentUser!.tokens.IdToken);

			listenerApi.dispatch(disableControlsLock());
	
			if (retrievedVideos == undefined || retrievedTagDefinitions == undefined) {
				return;
			}
	
			listenerApi.dispatch(setVideosWithoutQueue(retrievedVideos));
			listenerApi.dispatch(setTagDefinitionsWithoutQueue(retrievedTagDefinitions));
		}, 10);
	}
});

export default { authAccountDataMiddleware };
