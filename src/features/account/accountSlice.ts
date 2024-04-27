import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Timestamp in a queue (E.g. QueuedVideo.timestamp) is milliseconds from epoch for server compatibility.

export type QueuedVideo = {
	videoID: string;
	timestamp: number;
	position: number;
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

export type VideoQueueAppendInfo = {
	videoID: string;
	position: number;
}

export const accountSlice = createSlice({
	name: "account",
	initialState,
	reducers: {
		appendVideoToAccountQueue: (state, action: PayloadAction<VideoQueueAppendInfo>) => {
			let existingQueueIndex = state.updatedVideoIDsQueue.findIndex(x => x.videoID == action.payload.videoID);

			// Only one video ID is allowed in the queue at any one time, so remove the same video ID's from before.
			if (existingQueueIndex != -1) {
				state.updatedVideoIDsQueue.splice(existingQueueIndex, 1);
			}

			state.updatedVideoIDsQueue.push({
				videoID: action.payload.videoID,
				timestamp: Date.now(),
				position: action.payload.position
			});
		},
		appendVideoBatchToAccountQueue: (state, action: PayloadAction<VideoQueueAppendInfo[]>) => {
			// Same as the above comment, but for the whole array.
			state.updatedVideoIDsQueue = state.updatedVideoIDsQueue
				.filter(x => action.payload.findIndex(px => px.videoID == x.videoID) == -1)
				.concat(action.payload.map(x => {
					return {
						videoID: x.videoID,
						timestamp: Date.now(),
						position: x.position
					};
				}));
		},
		clearVideoAccountQueue: (state) => {
			state.updatedVideoIDsQueue = [];
		},
		clearTagsAccountQueue: (state) => {
			state.updatedTagIDsQueue = [];
		}
	}
})

export const { appendVideoToAccountQueue, appendVideoBatchToAccountQueue, clearVideoAccountQueue, clearTagsAccountQueue } = accountSlice.actions;
export default accountSlice.reducer;
