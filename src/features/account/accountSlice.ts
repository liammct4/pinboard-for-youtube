import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Timestamp in a queue (E.g. QueuedVideo.timestamp) is milliseconds from epoch for server compatibility.

export type QueuedVideo = {
	videoID: string;
	timestamp: number;
}

export type QueuedTag = {
	tagID: string;
	timestamp: number;
}

export interface IAccountSlice {
	updatedVideoIDsQueue: QueuedVideo[]
	updatedTagIDsQueue: QueuedTag[]
}

const initialState: IAccountSlice = {
	updatedVideoIDsQueue: [],
	updatedTagIDsQueue: []
}

export const accountSlice = createSlice({
	name: "account",
	initialState,
	reducers: {
		appendVideoToAccountQueue: (state, action: PayloadAction<string>) => {

			let existingQueueIndex = state.updatedVideoIDsQueue.findIndex(x => x.videoID == action.payload);

			// Only one video ID is allowed in the queue at any one time, so remove the same video ID's from before.
			if (existingQueueIndex != -1) {
				state.updatedVideoIDsQueue.splice(existingQueueIndex, 1);
			}

			state.updatedVideoIDsQueue.push({
				videoID: action.payload,
				timestamp: Date.now()
			});
		},
		appendVideoBatchToAccountQueue: (state, action: PayloadAction<string[]>) => {
			// Same as the above comment, but for the whole array.

			state.updatedVideoIDsQueue = state.updatedVideoIDsQueue
				.filter(x => action.payload.findIndex(px => px == x.videoID) == -1)
				.concat(action.payload.map(x => {
					return {
						videoID: x,
						timestamp: Date.now()
					};
				}));
		}
	}
})

export const { appendVideoToAccountQueue, appendVideoBatchToAccountQueue } = accountSlice.actions;
export default accountSlice.reducer;
