import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IPrimaryStorage } from "../../lib/storage/storage";
import { IVideo, TimestampID } from "../../lib/video/video";

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
		updateVideoSliceFromStorage: (state, action: PayloadAction<IPrimaryStorage>) => {
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
		},
		changeAutoplayTimestamp: (state, action: PayloadAction<{ videoID: string, timestamp: TimestampID }>) => {
			let video = state.videos[action.payload.videoID];

			if (video == undefined) {
				return;
			}

			if (video.autoplayTimestamp == action.payload.timestamp) {
				video.autoplayTimestamp = null;
			}
			else {
				video.autoplayTimestamp = action.payload.timestamp;
			}
		}
	}
});

export const videoActions = videoSlice.actions;
