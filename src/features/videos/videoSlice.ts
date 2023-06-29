import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import * as userData from "./../../lib/user/user-data.ts"
import type { RootState } from "../../app/store"
// @ts-ignore comment
import StorageArea from 'mem-storage-area/StorageArea'

interface IVideoState {
	currentVideos: Array<userData.Video>
}


// Runs if in dev build.
if (chrome.storage == undefined) {
	// @ts-ignore comment
	chrome.storage = {
		local: new StorageArea()
	}
}

await userData.ensureInitialized();

const initialState: IVideoState = {
	currentVideos: await userData.getStoredVideos()
}

export const videoSlice = createSlice({
	name: "video",
	initialState,
	reducers: {
		addVideo: (state, action: PayloadAction<userData.Video>) => {
			state.currentVideos.push(action.payload);
			userData.pushVideo(action.payload);
		},
		updateVideo: (state, action: PayloadAction<userData.Video>) => {
			for (let i = 0; i < state.currentVideos.length; i++) {
				if (state.currentVideos[i].videoID == action.payload.videoID) {
					state.currentVideos[i] = action.payload;
				}
			}

			userData.pushVideo(action.payload);
		},
		clearVideos: (state) => {
			state.currentVideos.length = 0;

			userData.clearStoredVideos();
		}
	}
})

export const { addVideo, updateVideo, clearVideos } = videoSlice.actions;
export default videoSlice.reducer;
