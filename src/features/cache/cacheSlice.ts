import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IYoutubeVideoInfo } from "../../lib/util/youtube/youtubeUtil";
import { IStorage } from "../../lib/storage/storage";

export interface ICacheSlice {
	videoCache: IYoutubeVideoInfo[]
}

const initialState: ICacheSlice = {
	videoCache: []
}

export const cacheSlice = createSlice({
	name: "cache",
	initialState,
	reducers: {
		updateCacheSliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.videoCache = action.payload.cache.videos;
		},
		saveVideoToCache: (state, action: PayloadAction<IYoutubeVideoInfo>) => {
			let index = state.videoCache.findIndex(x => x.video_id == action.payload.video_id);

			if (index == -1) {
				state.videoCache.push(action.payload);
				return;
			}

			state.videoCache[index] = action.payload;
		},
		clearCache: (state) => {
			state.videoCache = [];
		}
	}
})

export const cacheActions = cacheSlice.actions;
