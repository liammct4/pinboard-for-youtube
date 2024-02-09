import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, logoutCurrentUser, IAuthSlice } from "./authSlice.ts";
import { getStoredAuthTokens, setCurrentAuthenticatedUser } from "../../lib/user/storage.ts";
import { AuthenticationObject, invalidateRefreshToken } from "../../lib/user/accounts.ts";

const authStorageMiddleware = createListenerMiddleware();

authStorageMiddleware.startListening({
	matcher: isAnyOf(setCurrentUserAndStorage, logoutCurrentUser),
	effect: async (_action, listenerApi) => {
		let slice: IAuthSlice = listenerApi.getState() as IAuthSlice;

		if (slice.currentUser == undefined) {
			// Get old tokens to invalidate them.
			let tokens: AuthenticationObject | undefined = await getStoredAuthTokens();
			invalidateRefreshToken(tokens?.RefreshToken!, tokens?.IdToken!);
		}

		await setCurrentAuthenticatedUser(slice.currentUser);
	}
});

export default { authStorageMiddleware };
