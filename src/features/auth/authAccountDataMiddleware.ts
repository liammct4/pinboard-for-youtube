import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, IAuthSlice, setCurrentUser } from "./authSlice.ts";
import { userIsLoggedIn } from "../../lib/user/accounts.ts";
import { getAccountCloudVideos } from "../../lib/user/data/videos.ts";
import { setVideosWithoutQueue } from "../videos/videoSlice.ts";
import { getCurrentAuthenticatedUser } from "../../lib/user/storage.ts";
import { disableControlsLock, enableControlsLock } from "../state/tempStateSlice.ts";
import { Video } from "../../lib/video/video.ts";

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

			listenerApi.dispatch(disableControlsLock());
	
			if (retrievedVideos == undefined) {
				return;
			}
	
			listenerApi.dispatch(setVideosWithoutQueue(retrievedVideos));

		}, 10);
	}
});

export default { authAccountDataMiddleware };
