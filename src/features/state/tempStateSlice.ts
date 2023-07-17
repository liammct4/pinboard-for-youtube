import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IStateSlice {
	expandedVideoIDs: Array<string>
}

const initialState: IStateSlice = {
	expandedVideoIDs: []
}

export const tempStateSlice = createSlice({
	name: "tempState",
	initialState,
	reducers: {
		setTempState: (state, action: PayloadAction<IStateSlice>) => {
			state.expandedVideoIDs = action.payload.expandedVideoIDs;
		},
		addExpandedID: (state, action: PayloadAction<string>) => {
			if (!state.expandedVideoIDs.includes(action.payload)) {
				state.expandedVideoIDs.push(action.payload);
			}
		},
		removeExpandedID: (state, action: PayloadAction<string>) => {
			let index = state.expandedVideoIDs.findIndex(id => id == action.payload);

			if (index != -1) {
				state.expandedVideoIDs.splice(index, 1);
			}
		}
	}
})

export const { setTempState, addExpandedID, removeExpandedID } = tempStateSlice.actions;
export default tempStateSlice.reducer;
