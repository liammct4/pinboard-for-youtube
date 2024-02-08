import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAuthenticatedUser } from "../../lib/user/accounts";

export interface IAuthSlice {
	currentUser: IAuthenticatedUser | undefined;
}

const initialState: IAuthSlice = {
	currentUser: undefined
}

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCurrentUserAndStorage: (state, action: PayloadAction<IAuthenticatedUser>) => {
			state.currentUser = action.payload;
		},
		setCurrentUser: (state, action: PayloadAction<IAuthenticatedUser | undefined>) => {
			state.currentUser = action.payload;
		},
		logoutCurrentUser: (state) => {
			state.currentUser = undefined;
		}
	}
})

export const { setCurrentUserAndStorage, setCurrentUser, logoutCurrentUser } = authSlice.actions;
export default authSlice.reducer;
