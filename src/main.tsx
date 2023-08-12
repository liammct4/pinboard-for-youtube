import React from "react"
import ReactDOM from "react-dom/client"
import { store } from "./app/store.js"
import { Provider } from "react-redux"
import { getActiveTabURL } from "./lib/browser/page.ts"
import { IVideoSlice, setVideoState } from "./features/videos/videoSlice.ts"
import { getStoredVideos } from "./lib/storage/userData/userData.ts"
import { ensureInitialized } from "./lib/storage/storage.ts"
import { getVideoIdFromYouTubeLink, videoExists } from "./lib/util/youtube/youtubeUtil.ts"
import { IStateSlice, setTempState } from "./features/state/tempStateSlice.ts"
import { getExpandedVideos } from "./lib/storage/tempState/tempState.ts"
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, Router, RouterProvider, Routes } from "react-router-dom";
import HomePage from "./routes/HomePage.tsx"
import VideosPage from "./routes/Videos/VideosPage.tsx"
import MenuPage from "./routes/Menu/MenuPage.tsx"
import OptionsPage from "./routes/Menu/Options/OptionsPage.tsx"
import HelpPage from "./routes/Menu/Help/HelpPage.tsx"
import "./../public/common-definitions.css"
import "./../public/globals.css"
import "./main.css"

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
	
	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<Provider store={store}>
				<RouterProvider router={createBrowserRouter(createRoutesFromElements(
					<Route path="/*" element={<HomePage/>}>
						<Route path="videos" element={<VideosPage/>}/>
						<Route path="menu" element={<MenuPage/>}>
							<Route path="options" element={<OptionsPage/>}/>
							<Route path="help" element={<HelpPage/>}/>				
						</Route>
						<Route path="*" element={<Navigate to="/videos" replace/>}/>
					</Route>
				))}/>
			</Provider>
		</React.StrictMode>
	);
}

await setupState();
