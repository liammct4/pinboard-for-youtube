import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, logoutCurrentUser, IAuthSlice } from "./authSlice.ts";
import { saveLogoutUser, setCurrentAuthenticatedUser } from "../../lib/user/storage.ts";

const authStorageMiddleware = createListenerMiddleware();

authStorageMiddleware.startListening({
	matcher: isAnyOf(setCurrentUserAndStorage, logoutCurrentUser),
	effect: async (_action, _listenerApi) => {
		let slice: IAuthSlice = _listenerApi.getState() as IAuthSlice;
		if (slice.currentUser == undefined) {
			await saveLogoutUser();
			return;
		}

		await setCurrentAuthenticatedUser(slice.currentUser);
	}
});

export default { authStorageMiddleware };
