import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LayoutState, VideoPresentationStyle } from "../../lib/storage/tempState/layoutState";
import { IStorage } from "../../lib/storage/storage";

export interface IStateSlice {
	expandedVideoIDs: string[];
	videoBrowserScrollDistance: number;
	currentDirectory: string;
	layout: LayoutState;
	temporarySingleState: {
		onRequestIsVideoControlLocked: boolean;
	};
}

const initialState: IStateSlice = {
	expandedVideoIDs: [],
	currentDirectory: "$",
	videoBrowserScrollDistance: 0,
	layout: {
		isCurrentVideosSectionExpanded: true,
		videoItemViewStyle: "MINIMAL",
		isDirectoryBrowserSettingsExpanded: false
	},
	temporarySingleState: {
		onRequestIsVideoControlLocked: false
	}
}

export const tempStateSlice = createSlice({
	name: "tempState",
	initialState,
	reducers: {
		updateTempSliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.expandedVideoIDs = action.payload.tempState.expandedVideos;
			state.currentDirectory = action.payload.tempState.currentDirectoryPath;
			state.layout = action.payload.tempState.layout;
			state.videoBrowserScrollDistance = action.payload.tempState.videoBrowserScrollDistance;
		},
		setVideoBrowserScrollDistance: (state, action: PayloadAction<number>) => {
			state.videoBrowserScrollDistance = action.payload;
		},
		expandVideo: (state, action: PayloadAction<string>) => {
			if (!state.expandedVideoIDs.includes(action.payload)) {
				state.expandedVideoIDs.push(action.payload);
			}
		},
		collapseVideo: (state, action: PayloadAction<string>) => {
			let index = state.expandedVideoIDs.findIndex(id => id == action.payload);

			if (index != -1) {
				state.expandedVideoIDs.splice(index, 1);
			}
		},
		changeVideoViewStyle: (state, action: PayloadAction<VideoPresentationStyle>) => { state.layout.videoItemViewStyle = action.payload },
		setLayoutState: (state, action: PayloadAction<LayoutState>) => { state.layout = action.payload },
		enableControlsLock: (state) => { state.temporarySingleState.onRequestIsVideoControlLocked = true },
		disableControlsLock: (state) => { state.temporarySingleState.onRequestIsVideoControlLocked = false },
		setDirectoryPath: (state, action: PayloadAction<string>) => { state.currentDirectory = action.payload }
	}
})

export const tempStateActions = tempStateSlice.actions;
