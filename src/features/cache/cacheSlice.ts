import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IYoutubeVideoInfo } from "../../lib/util/youtube/youtubeUtil";

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
		saveVideoToCache: (state, action: PayloadAction<IYoutubeVideoInfo>) => {
			let index = state.videoCache.findIndex(x => x.video_id == action.payload.video_id);

			if (index == -1) {
				state.videoCache.push(action.payload);
				return;
			}

			state.videoCache[index] = action.payload;
		},
		setCacheState: (state, action: PayloadAction<ICacheSlice>) => {
			state.videoCache = action.payload.videoCache;
		}
	}
})

export const {
	saveVideoToCache,
	setCacheState
} = cacheSlice.actions;
export default cacheSlice.reducer;
