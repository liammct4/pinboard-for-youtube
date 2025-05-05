import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IStorage } from "../../lib/storage/storage";
import { IVideo } from "../../lib/video/video";

export interface IVideoSlice {
	videos: IVideo[];
}

const initialState: IVideoSlice = {
	videos: []
}

export const videoSlice = createSlice({
	name: "video",
	initialState,
	reducers: {
		updateVideoSliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.videos = action.payload.userData.videos;
		},
		addVideo: (state, action: PayloadAction<IVideo>) => {
			let existingIndex = state.videos.findIndex(x => x.id == action.payload.id)

			if (existingIndex != -1) {
				return;
			}

			state.videos.push(action.payload);
		},
		removeVideo: (state, action: PayloadAction<string>) => {
			let index = state.videos.findIndex(x => x.id == action.payload);

			if (index == -1) {
				return;
			}

			state.videos.splice(index, 1);
		},
		addOrReplaceVideo: (state, action: PayloadAction<IVideo>) => {
			let index = state.videos.findIndex(x => x.id == action.payload.id);

			if (index == -1) {
				state.videos.push(action.payload);
			}
			else {
				state.videos[index] = action.payload;
			}
		},
		setVideos: (state, action: PayloadAction<IVideo[]>) => {
			state.videos = action.payload;
		},
		clearVideos: (state) => {
			state.videos = [];
		}
	}
});

export const videoActions = videoSlice.actions;
