import { createSlice } from "@reduxjs/toolkit"

export const videoSlice = createSlice({
	name: "video",
	initialState: {
		testValue: 0,
	},
	reducers: {
		setValue: (state, action) => {
			state.testValue = action.payload;
		},
	},
})

export const { setValue } = videoSlice.actions;
export default videoSlice.reducer;
