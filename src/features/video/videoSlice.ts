import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IStorage } from "../../lib/storage/storage";
import { IVideo } from "../../lib/video/video";
import { sampleVideoData } from "../../../testData/testDataSet";

export interface IVideoSlice {
	activeVideoID: string | undefined;
	videos: {
		[videoID: string]: IVideo | undefined
	};
}

const initialState: IVideoSlice = {
	activeVideoID: undefined,
	videos: {}
}

export const videoSlice = createSlice({
	name: "video",
	initialState,
	reducers: {
		updateVideoSliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.videos = action.payload.userData.videos;
		},
		changeActiveVideoID: (state, action: PayloadAction<string>) => {
			state.activeVideoID = action.payload;
		},
		addVideo: (state, action: PayloadAction<IVideo>) => {
			let existingVideo = state.videos[action.payload.id];

			if (existingVideo != undefined) {
				return;
			}

			state.videos[action.payload.id] = action.payload;
		},
		removeVideos: (state, action: PayloadAction<string[]>) => {
			for (let video of action.payload) {
				if (state.videos[video] == undefined) {
					continue;
				}

				delete state.videos[video];
			}
		},
		addOrReplaceVideo: (state, action: PayloadAction<IVideo>) => {
			state.videos[action.payload.id] = action.payload;
		},
		setVideos: (state, action: PayloadAction<{ [videoID: string]: IVideo }>) => {
			state.videos = action.payload;
		},
		clearVideos: (state) => {
			state.videos = {};
		}
	}
});

export const videoActions = videoSlice.actions;
