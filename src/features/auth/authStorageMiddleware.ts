import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentUserAndStorage, logoutCurrentUser, IAuthSlice, setAccessAndIDTokens } from "./authSlice.ts";
import { AuthenticationObject, invalidateRefreshToken } from "../../lib/user/accounts.ts";
import { getItemFromNode } from "../../components/video/navigation/directory.ts";
import { getItemFromStorage, modifyStorage } from "../../lib/storage/storage.ts";

export const authChangeUserStorageMiddleware = createListenerMiddleware();
export const authTokenChangedMiddleware = createListenerMiddleware();

authChangeUserStorageMiddleware.startListening({
	matcher: isAnyOf(setCurrentUserAndStorage, logoutCurrentUser),
	effect: async (_action, listenerApi) => {
		let slice: IAuthSlice = listenerApi.getState() as IAuthSlice;

		if (slice.currentUser == undefined) {
			// Get old tokens to invalidate them.
			let tokens: AuthenticationObject | undefined = await getItemFromStorage(s => s.auth.currentUser?.tokens);
			invalidateRefreshToken(tokens?.RefreshToken!, tokens?.IdToken!);
		}

		modifyStorage(s => s.auth.currentUser = slice.currentUser);
	}
});

authTokenChangedMiddleware.startListening({
	matcher: isAnyOf(setAccessAndIDTokens),
	effect: async (action) => {
		modifyStorage(s => {
			if (s.auth.currentUser == undefined) {
				return;
			}
			
			s.auth.currentUser.tokens = {
				RefreshToken: s.auth.currentUser.tokens.RefreshToken,
				AccessToken: action.payload.accessToken,
				IdToken: action.payload.idToken
			}
		});
	}
})
