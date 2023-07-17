import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store } from "./app/store.js"
import { Provider } from "react-redux"
import { getActiveTab, getActiveTabURL } from './lib/browser/page.ts'
import { IVideoSlice, setVideoState } from './features/videos/videoSlice.ts'
import { getVideoIdFromYouTubeLink, videoExists } from './lib/youtube-util.ts'
import { getStoredVideos } from './lib/storage/user-data.ts'
import { ensureInitialized } from './lib/storage/storage.ts'
import { IStateSlice, setTempState } from './features/state/tempStateSlice.ts'
import { getExpandedVideos } from './lib/storage/tempState.ts'
import './main.css'

if (chrome.extension != null) {
	// Link the YouTube page to the chrome messaging system.
	chrome.scripting.executeScript({
		target: { tabId: (await getActiveTab()).id },
		files: ["content_script.js"]
	});
}

async function setupState() {
	await ensureInitialized();

	let activeID = undefined;

	if (chrome.extension != null) {
		let currentUrl: string | undefined = await getActiveTabURL();

		if (currentUrl != undefined && videoExists(currentUrl)) {
			// Means that the current page is not a youtube video.
			activeID = getVideoIdFromYouTubeLink(currentUrl);
		}
	}
	else {
		activeID = "xcJtL7QggTI";
	}

	let videoState: IVideoSlice = {
		activeVideoID: activeID,
		currentVideos: await getStoredVideos()
	}

	let tempState: IStateSlice = {
		expandedVideoIDs: await getExpandedVideos()
	}

	store.dispatch(setVideoState(videoState));
	store.dispatch(setTempState(tempState));
	
	ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
		<React.StrictMode>
			<Provider store={store}>
				<App/>
			</Provider>
		</React.StrictMode>
	);
}

await setupState();
