import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, IAuthSlice, setCurrentUser } from "./authSlice.ts";
import { userIsLoggedIn } from "../../lib/user/accounts.ts";
import { getAccountCloudVideos } from "../../lib/user/data/videos.ts";
import { setVideosWithoutQueue } from "../videos/videoSlice.ts";
import { Video } from "../../lib/video/video.ts";
import { getCurrentAuthenticatedUser } from "../../lib/user/storage.ts";

const authAccountDataMiddleware = createListenerMiddleware();

authAccountDataMiddleware.startListening({
	matcher: isAnyOf(setCurrentUserAndStorage, setCurrentUser),
	effect: (_action, listenerApi) => {
		setTimeout(async () => {
			if (!await userIsLoggedIn()) {
				return;
			}

			let currentUser = await getCurrentAuthenticatedUser();
			let retrievedVideos: Video[] | undefined = await getAccountCloudVideos(currentUser!.tokens.IdToken);
	
			if (retrievedVideos == undefined) {
				return;
			}
	
			listenerApi.dispatch(setVideosWithoutQueue(retrievedVideos));

		}, 10);
	}
});

export default { authAccountDataMiddleware };
