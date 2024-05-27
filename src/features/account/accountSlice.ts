import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Timestamp in a queue (E.g. QueuedVideo.timestamp) is milliseconds from epoch for server compatibility.

export type ServerResourceType = "VIDEO" | "TAG" | "THEME";

export type DataMutation = {
	dataID: string;
	timestamp: number;
	position: number;
}

export interface IAccountSlice {
	updatedVideoIDsQueue: DataMutation[]
	updatedTagIDsQueue: DataMutation[]
	updatedThemeIDsQueue: DataMutation[]
}

const initialState: IAccountSlice = {
	updatedVideoIDsQueue: [],
	updatedTagIDsQueue: [],
	updatedThemeIDsQueue: []
}

export interface IQueueAppendInfo {
	mutationDataID: string;
	position: number;
}

export interface ISingularQueueAppendInfo extends IQueueAppendInfo {
	dataMutationType: ServerResourceType;
}

export interface IBatchQueueAppendInfo {
	info: IQueueAppendInfo[],
	dataMutationType: ServerResourceType
}

export const accountSlice = createSlice({
	name: "account",
	initialState,
	reducers: {
		appendMutationToAccountQueue: (state, action: PayloadAction<ISingularQueueAppendInfo>) => {
			let source: DataMutation[];

			switch (action.payload.dataMutationType) {
				case "VIDEO":
					source = state.updatedVideoIDsQueue;
					break;
				case "TAG":
					source = state.updatedTagIDsQueue;
					break;
				case "THEME":
					source = state.updatedThemeIDsQueue;
					break;
			}

			let existingQueueIndex = source.findIndex(x => x.dataID == action.payload.mutationDataID);

			// Only one video ID is allowed in the queue at any one time, so remove the same data ID's from before.
			if (existingQueueIndex != -1) {
				source.splice(existingQueueIndex, 1);
			}

			let newMutation = {
				dataID: action.payload.mutationDataID,
				timestamp: Date.now(),
				position: action.payload.position
			};

			// Passed by reference, so no need to reference the original source array in the slice.
			source.push(newMutation);
		},
		appendMutationBatchToAccountQueue: (state, action: PayloadAction<IBatchQueueAppendInfo>) => {
			// Same as the above comment, but for the whole array.
			let source: DataMutation[];

			switch (action.payload.dataMutationType) {
				case "VIDEO":
					source = state.updatedVideoIDsQueue;
					break;
				case "TAG":
					source = state.updatedTagIDsQueue;
					break;
				case "THEME":
					source = state.updatedThemeIDsQueue;
					break;
			}

			source = source
				.filter(x => action.payload.info.findIndex(px => px.mutationDataID == x.dataID) == -1)
				.concat(action.payload.info.map(x => {
					return {
						dataID: x.mutationDataID,
						timestamp: Date.now(),
						position: x.position
					};
				}));
		},
		pushQueues: () => {
			
		},
		clearVideoAccountQueue: (state) => {
			state.updatedVideoIDsQueue = [];
		},
		clearTagsAccountQueue: (state) => {
			state.updatedTagIDsQueue = [];
		}
	}
})

export const { appendMutationToAccountQueue, appendMutationBatchToAccountQueue, clearVideoAccountQueue, clearTagsAccountQueue, pushQueues } = accountSlice.actions;
export default accountSlice.reducer;
