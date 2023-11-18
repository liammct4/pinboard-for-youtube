import React from "react"
import ReactDOM from "react-dom/client"
import { store } from "./app/store.js"
import { Provider } from "react-redux"
import { getActiveTabURL } from "./lib/browser/page.ts"
import { IVideoSlice, setVideoState } from "./features/videos/videoSlice.ts"
import { getStorageTagDefinitions, getStoredVideos } from "./lib/storage/userData/userData.ts"
import { ensureInitialized } from "./lib/storage/storage.ts"
import { getVideoIdFromYouTubeLink, videoExists } from "./lib/util/youtube/youtubeUtil.ts"
import { IStateSlice, setTempState } from "./features/state/tempStateSlice.ts"
import { getExpandedVideos } from "./lib/storage/tempState/tempState.ts"
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, Router, RouterProvider, Routes } from "react-router-dom";
import HomePage from "./routes/HomePage.tsx"
import { VideosPage } from "./routes/Videos/VideosPage.tsx"
import MenuPage from "./routes/Menu/MenuPage.tsx"
import OptionsPage from "./routes/Menu/Options/OptionsPage.tsx"
import HelpPage from "./routes/Menu/Help/HelpPage.tsx"
import { GeneralPage } from "./routes/Menu/Options/General/GeneralPage.tsx"
import { AppearancePage } from "./routes/Menu/Options/Appearance/AppearancePage.tsx"
import { AccountsPage } from "./routes/Menu/Options/Accounts/AccountsPage.tsx"
import { OptionsNavigator } from "./routes/Menu/Options/OptionsNavigator.tsx"
import { getCurrentTheme, getCustomThemes } from "./lib/storage/config/theme/theme.ts"
import { setCurrentTheme, setCustomThemes } from "./features/theme/themeSlice.ts"
import { TagsPage } from "./routes/Tags/TagsPage.tsx"
import { EditTagPage } from "./routes/Tags/EdItTagPage/EditTagPage.tsx"
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

	let tagDefinitions = await getStorageTagDefinitions();

	let videoState: IVideoSlice = {
		activeVideoID: activeID,
		currentVideos: await getStoredVideos(),
		tagDefinitions: tagDefinitions
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
						<Route path="tags" element={<TagsPage/>}>
							<Route path="edit/:tagId" element={<EditTagPage/>}/>
						</Route>
						<Route path="menu" element={<MenuPage/>}>
							<Route path="options/*" element={<OptionsPage/>}>
								<Route path="general" element={<GeneralPage/>}/>
								<Route path="accounts" element={<AccountsPage/>}/>
								<Route path="appearance/*" element={<AppearancePage/>}/>
								<Route path="*" element={<OptionsNavigator/>}/>
							</Route>
							<Route path="help" element={<HelpPage/>}/>				
						</Route>
						<Route path="*" element={<Navigate to="/videos" replace/>}/>
					</Route>
				))}/>
			</Provider>
		</React.StrictMode>
	);
	
	// Retrieve the current theme from storage since it cannot be loaded in initial state.
	store.dispatch(setCurrentTheme(await getCurrentTheme()));
	store.dispatch(setCustomThemes(await getCustomThemes()));
}

await setupState();
