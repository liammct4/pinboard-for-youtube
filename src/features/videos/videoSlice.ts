import { createSlice, PayloadAction } from "@reduxjs/toolkit"
// @ts-ignore
import StorageArea from 'mem-storage-area/StorageArea'
import { TagDefinition, Video } from "../../lib/video/video.ts";

export interface IVideoSlice {
	activeVideoID?: string;
	currentVideos: Array<Video>;
	tagDefinitions: Array<TagDefinition>;
	currentSelectedTagFilter: string;
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
	currentSelectedTagFilter: "",
	currentVideos: [],
	tagDefinitions: []
}

export const videoSlice = createSlice({
	name: "video",
	initialState,
	reducers: {
		setVideoState: (state, action: PayloadAction<IVideoSlice>) => {
			state.activeVideoID = action.payload.activeVideoID;
			state.currentVideos = action.payload.currentVideos;
			state.currentSelectedTagFilter = action.payload.currentSelectedTagFilter;
			state.tagDefinitions = action.payload.tagDefinitions;
		},
		addVideo: (state, action: PayloadAction<Video>) => {
			state.currentVideos.push(action.payload);
		},
		// Accepts a video ID.
		removeVideo: (state, action: PayloadAction<string>) => {
			let index = state.currentVideos.findIndex(x => x.videoID == action.payload);

			if (index == -1) {
				return;
			}

			state.currentVideos.splice(index, 1);
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
		setVideosWithoutQueue: (state, action: PayloadAction<Array<Video>>) => {
			state.currentVideos = action.payload;
		},
		addTagDefinition: (state, action: PayloadAction<TagDefinition>) => {
			for (let i = 0; i < state.tagDefinitions.length; i++) {
				let tag = state.tagDefinitions[i];

				// E.g. has been updated.
				if (tag.id == action.payload.id) {
					// Need to reinsert it into the correct place. So delete and let the code below handle it.
					state.tagDefinitions.splice(i, 1);
					break;
				}
				else if (tag.name == action.payload.name) {
					// Duplicate name, so don't add.
					return;
				}
			}

			// Insert the tag into the correct position. Because tags have to be alphabetically sorted by name.
			let inserted = false;

			for (let i = 0; i < state.tagDefinitions.length; i++) {
				if (state.tagDefinitions[i].name > action.payload.name) {
					state.tagDefinitions.splice(i, 0, action.payload);
					inserted = true;
					
					break;
				}
			}

			if (!inserted) {
				state.tagDefinitions.push(action.payload);
			}
		},
		removeTagDefinition: (state, action: PayloadAction<string>) => {
			let index = state.tagDefinitions.findIndex(x => x.id == action.payload);

			state.tagDefinitions.splice(index, 1);
		},
		setTagDefinitions: (state, action: PayloadAction<Array<TagDefinition>>) => {
			state.tagDefinitions = action.payload;
		},
		setTagDefinitionsWithoutQueue: (state, action: PayloadAction<Array<TagDefinition>>) => {
			state.tagDefinitions = action.payload;
		},
		setTagFilter: (state, action: PayloadAction<string>) => {
			state.currentSelectedTagFilter = action.payload;
		}
	}
})

export const {
	setVideoState,
	addVideo,
	updateVideo,
	removeVideo,
	clearVideos,
	setVideos,
	setVideosWithoutQueue,
	addTagDefinition,
	removeTagDefinition,
	setTagDefinitions,
	setTagDefinitionsWithoutQueue,
	setTagFilter
} = videoSlice.actions;
export default videoSlice.reducer;
