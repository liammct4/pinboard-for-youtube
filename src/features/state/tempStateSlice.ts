import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LayoutState } from "../../lib/storage/tempState/layoutState";

export interface IStateSlice {
	expandedVideoIDs: Array<string>;
	layout: LayoutState
}

const initialState: IStateSlice = {
	expandedVideoIDs: [],
	layout: {
		isCurrentVideosSectionExpanded: true
	}
}

export const tempStateSlice = createSlice({
	name: "tempState",
	initialState,
	reducers: {
		setTempState: (state, action: PayloadAction<IStateSlice>) => {
			state.expandedVideoIDs = action.payload.expandedVideoIDs;
			state.layout = action.payload.layout;
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
		},
		setLayoutState: (state, action: PayloadAction<LayoutState>) => {
			state.layout = action.payload;
		}
	}
})

export const { setTempState, addExpandedID, removeExpandedID, setLayoutState } = tempStateSlice.actions;
export default tempStateSlice.reducer;
