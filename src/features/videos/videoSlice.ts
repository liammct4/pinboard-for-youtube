import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import * as userData from "./../../lib/user/user-data.ts"
// @ts-ignore comment
import StorageArea from 'mem-storage-area/StorageArea'
import { getActiveTabURL } from "../../lib/browser/page.ts";
import { getVideoIdFromYouTubeLink, videoExists } from "../../lib/youtube-util.ts";

interface IVideoSlice {
	activeVideoID?: string;
	currentVideos: Array<userData.Video>;
}
var activeID: string | undefined = undefined;

// Runs if in dev build.
if (chrome.storage == undefined) {
	// @ts-ignore comment
	chrome.storage = {
		local: new StorageArea()
	}

	activeID = "xcJtL7QggTI";
}
else {
	let currentUrl: string | undefined = await getActiveTabURL();
	
	if (currentUrl != undefined && videoExists(currentUrl)) {
		// Means that the current page is not a youtube video.
		activeID = getVideoIdFromYouTubeLink(currentUrl);
	}
}

await userData.ensureInitialized();

const initialState: IVideoSlice = {
	activeVideoID: activeID,
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
