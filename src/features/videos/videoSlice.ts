import { createSlice, PayloadAction } from "@reduxjs/toolkit"
// @ts-ignore
import StorageArea from 'mem-storage-area/StorageArea'
import { TagDefinition, Video } from "../../lib/video/video.ts";
import { convertArrayToMap } from "../../lib/util/json/map.ts";

export interface IVideoSlice {
	activeVideoID?: string;
	currentVideos: Array<Video>;
	tagDefinitions: Map<string, TagDefinition>;
}

// Runs if in dev build.
if (chrome.storage == undefined) {
	// @ts-ignore This runs first.
	chrome.storage = {
		local: new StorageArea()
	}
}

const initialState: IVideoSlice = {
	activeVideoID: undefined,
	currentVideos: [],
	tagDefinitions: new Map()
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
		},
		updateVideo: (state, action: PayloadAction<Video>) => {
			for (let i = 0; i < state.currentVideos.length; i++) {
				if (state.currentVideos[i].videoID == action.payload.videoID) {
					state.currentVideos[i] = action.payload;
				}
			}
		},
		clearVideos: (state) => {
			state.currentVideos.length = 0;
		},
		setVideos: (state, action: PayloadAction<Array<Video>>) => {
			state.currentVideos = action.payload;
		},
		addTagDefinition: (state, action: PayloadAction<TagDefinition>) => {
			state.tagDefinitions.set(action.payload.name, action.payload);
		},
		removeTagDefinition: (state, action: PayloadAction<TagDefinition>) => {
			state.tagDefinitions.delete(action.payload.name);
		},
		setTagDefinitions: (state, action: PayloadAction<Array<TagDefinition>>) => {
			state.tagDefinitions = convertArrayToMap(action.payload, (item) => item.name);
		}
	}
})

export const {
	setVideoState,
	addVideo,
	updateVideo,
	clearVideos,
	setVideos,
	addTagDefinition,
	removeTagDefinition,
	setTagDefinitions
} = videoSlice.actions;
export default videoSlice.reducer;
