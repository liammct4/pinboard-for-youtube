import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, logoutCurrentUser, IAuthSlice, setAccessAndIDTokens } from "./authSlice.ts";
import { getCurrentAuthenticatedUser, getStoredAuthTokens, setCurrentAuthenticatedUser, setStoredAuthTokens } from "../../lib/user/storage.ts";
import { AuthenticationObject, invalidateRefreshToken } from "../../lib/user/accounts.ts";

const authChangeUserStorageMiddleware = createListenerMiddleware();
const authTokenChangedMiddleware = createListenerMiddleware();

authChangeUserStorageMiddleware.startListening({
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

authTokenChangedMiddleware.startListening({
	matcher: isAnyOf(setAccessAndIDTokens),
	effect: async (action) => {
		let currentUser = await getCurrentAuthenticatedUser();

		await setStoredAuthTokens({
			RefreshToken: currentUser!.tokens.RefreshToken,
			AccessToken: action.payload.accessToken,
			IdToken: action.payload.idToken
		});
	}
})

export default { authChangeUserStorageMiddleware, authTokenChangedMiddleware };
