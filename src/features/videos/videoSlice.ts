import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

interface IVideoState {
	testValue: number
}

const initialState: IVideoState = {
	testValue: 0
}

export const videoSlice = createSlice({
	name: "video",
	initialState,
	reducers: {
		setValue: (state, action: PayloadAction<number>) => {
			state.testValue = action.payload;
		},
	}
})

export const { setValue } = videoSlice.actions;
export default videoSlice.reducer;
