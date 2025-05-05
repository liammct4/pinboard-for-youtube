import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DataMutation } from "../../components/features/useUserAccount";
import { IVideo } from "../../lib/video/video";
import { IAppTheme } from "../../lib/config/theming/appTheme";
import { IStorage } from "../../lib/storage/storage";
import { IDirectoryModificationAction } from "../../lib/user/resources/directory";

export interface IMutationSlice {
	videoPendingQueue: DataMutation<IVideo>[],
	themePendingQueue: DataMutation<IAppTheme>[],
	directoryPendingQueue: DataMutation<IDirectoryModificationAction>[]
}

const initialState: IMutationSlice = {
	videoPendingQueue: [],
	directoryPendingQueue: [],
	themePendingQueue: []
}

export const mutationSlice = createSlice({
	name: "mutation",
	initialState,
	reducers: {
		appendRequestToVideos: (state, action: PayloadAction<DataMutation<IVideo>>) => {
			state.videoPendingQueue.push(action.payload);
		},
		appendRequestToDirectory: (state, action: PayloadAction<DataMutation<IDirectoryModificationAction>>) => {
			state.directoryPendingQueue.push(action.payload);
		},
		appendRequestToThemes: (state, action: PayloadAction<DataMutation<IAppTheme>>) => {
			state.themePendingQueue.push(action.payload);
		},
		clearMutationQueues: (state) => {
			state.videoPendingQueue = [];
			state.directoryPendingQueue = [];
			state.themePendingQueue = [];
		},
		clearVideoQueue: (state) => {
			state.videoPendingQueue = [];
		},
		clearDirectoryQueue: (state) => {
			state.directoryPendingQueue = [];
		},
		clearThemeQueue: (state) => {
			state.themePendingQueue = [];
		},
	}
})

export const mutationActions = mutationSlice.actions;
