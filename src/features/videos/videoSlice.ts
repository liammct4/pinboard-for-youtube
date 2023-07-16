import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import * as userData from "../../lib/storage/user-data.ts"
// @ts-ignore comment
import StorageArea from 'mem-storage-area/StorageArea'
import { Video } from "../../lib/video/video.ts";

export interface IVideoSlice {
	activeVideoID?: string;
	currentVideos: Array<Video>;
}

// Runs if in dev build.
if (chrome.storage == undefined) {
	// @ts-ignore comment
	chrome.storage = {
		local: new StorageArea()
	}
}

const initialState: IVideoSlice = {
	activeVideoID: undefined,
	currentVideos: []
}

export const videoSlice = createSlice({
	name: "video",
	initialState,
	reducers: {
		setVideoState: (state, action: PayloadAction<IVideoSlice>) => {
			state.activeVideoID = action.payload.activeVideoID;
			state.currentVideos = action.payload.currentVideos;
		},
		addVideo: (state, action: PayloadAction<Video>) => {
			state.currentVideos.push(action.payload);
			userData.pushVideo(action.payload);
		},
		updateVideo: (state, action: PayloadAction<Video>) => {
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

export const { setVideoState, addVideo, updateVideo, clearVideos } = videoSlice.actions;
export default videoSlice.reducer;
