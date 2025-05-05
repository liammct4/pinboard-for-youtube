import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAuthenticatedUser, TemporaryTokens } from "../../lib/user/accounts";
import { IStorage } from "../../lib/storage/storage";

export interface IAuthSlice {
	currentUser: IAuthenticatedUser | undefined;
	currentUserUnverified: IAuthenticatedUser | undefined;
}

const initialState: IAuthSlice = {
	currentUser: undefined,
	currentUserUnverified: undefined
}

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		updateAuthSliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.currentUser = action.payload.auth.currentUser;
		},
		setCurrentUserAndStorage: (state, action: PayloadAction<IAuthenticatedUser>) => {
			state.currentUser = action.payload;
		},
		setCurrentUser: (state, action: PayloadAction<IAuthenticatedUser | undefined>) => {
			state.currentUser = action.payload;
		},
		logoutCurrentUser: (state) => {
			state.currentUser = undefined;
		},
		setAccessAndIDTokens: (state, action: PayloadAction<TemporaryTokens>) => {
			if (state.currentUser != undefined) {
				state.currentUser.tokens.IdToken = action.payload.idToken;
				state.currentUser.tokens.AccessToken = action.payload.accessToken;
			}
		}
	}
})

export const authActions = authSlice.actions;
