import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LayoutState } from "../../lib/storage/tempState/layoutState";

export interface IStateSlice {
	expandedVideoIDs: string[];
	videoBrowserScrollDistance: number;
	layout: LayoutState;
	temporarySingleState: {
		onRequestIsVideoControlLocked: boolean;
	};
}

const initialState: IStateSlice = {
	expandedVideoIDs: [],
	videoBrowserScrollDistance: 0,
	layout: {
		isCurrentVideosSectionExpanded: true
	},
	temporarySingleState: {
		onRequestIsVideoControlLocked: false
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
		setVideoBrowserScrollDistance: (state, action: PayloadAction<number>) => {
			state.videoBrowserScrollDistance = action.payload;
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
		},
		enableControlsLock: (state) => {
			state.temporarySingleState.onRequestIsVideoControlLocked = true;
		},
		disableControlsLock: (state) => {
			state.temporarySingleState.onRequestIsVideoControlLocked = false;
		}
	}
})

export const {
	setTempState,
	addExpandedID,
	removeExpandedID,
	setLayoutState,
	enableControlsLock,
	disableControlsLock,
	setVideoBrowserScrollDistance
} = tempStateSlice.actions;
export default tempStateSlice.reducer;
