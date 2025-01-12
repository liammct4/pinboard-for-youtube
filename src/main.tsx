import React from "react"
import ReactDOM from "react-dom/client"
import { store } from "./app/store.js"
import { Provider } from "react-redux"
import { getActiveTabURL } from "./lib/browser/page.ts"
import { getVideoDictionary } from "./lib/storage/userData/userData.ts"
import { ensureInitialized } from "./lib/storage/storage.ts"
import { getVideoIdFromYouTubeLink, doesVideoExist } from "./lib/util/youtube/youtubeUtil.ts"
import { IStateSlice, setTempState } from "./features/state/tempStateSlice.ts"
import { getExpandedVideos, getLayoutState } from "./lib/storage/tempState/tempState.ts"
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, Router, RouterProvider, Routes } from "react-router-dom";
import { HomePage } from "./routes/HomePage.tsx"
import { VideosPage } from "./routes/Videos/VideosPage.tsx"
import { MenuPage } from "./routes/Menu/MenuPage.tsx"
import { OptionsPage } from "./routes/Menu/Options/OptionsPage.tsx"
import { HelpPage } from "./routes/Menu/Help/HelpPage.tsx"
import { GeneralPage } from "./routes/Menu/Options/General/GeneralPage.tsx"
import { AppearancePage } from "./routes/Menu/Options/Appearance/AppearancePage.tsx"
import { AccountsPage } from "./routes/Menu/Options/Accounts/AccountsPage.tsx"
import { OptionsNavigator } from "./routes/Menu/Options/OptionsNavigator.tsx"
import { getCurrentTheme, getCustomThemes } from "./lib/storage/config/theme/theme.ts"
import { setCurrentTheme, setCustomThemes } from "./features/theme/themeSlice.ts"
import { DebugPage } from "./routes/Menu/Options/Debug/DebugPage.tsx"
import { setCurrentUser } from "./features/auth/authSlice.ts"
import { getCurrentAuthenticatedUser } from "./lib/user/storage.ts"
import { PfyWrapper } from "./routes/PfyWrapper.tsx"
import { getUserSettingsStorage } from "./lib/storage/config/config.ts"
import { initializeAndSetSettingsDefault, setSettingValues } from "./features/settings/settingsSlice.ts"
import { ErrorPage } from "./routes/ErrorPage/ErrorPage.tsx"
import { ICacheSlice, setCacheState } from "./features/cache/cacheSlice.ts"
import { getVideoCacheFromStorage } from "./lib/storage/cache/cache.ts"
import { checkAndImplementLocalStorage } from "./lib/browser/features/localStorage.ts"
import "./../public/common-definitions.css"
import "./../public/globals.css"
import "./main.css"
import { VideoDirectoryContext } from "./context/video.ts"
import { IDirectoryNode } from "./components/video/navigation/directory.ts"

checkAndImplementLocalStorage();

async function setupState() {
	await ensureInitialized();

	let activeID;

	if (chrome.extension != null) {
		let currentUrl: string | undefined = await getActiveTabURL();

		if (currentUrl != undefined && doesVideoExist(currentUrl)) {
			// If an error happens, it means that the current page is not a youtube video.
			try {
				activeID = getVideoIdFromYouTubeLink(currentUrl);
			} catch { }
		}
	}
	else {
		activeID = "xcJtL7QggTI";
	}

	let tempState: IStateSlice = {
		expandedVideoIDs: await getExpandedVideos(),
		layout: await getLayoutState(),
		temporarySingleState: {
			onRequestIsVideoControlLocked: false
		}
	}

	let cacheState: ICacheSlice = {
		//@ts-ignore
		videoCache: await getVideoCacheFromStorage()
	};

	store.dispatch(setTempState(tempState));
	store.dispatch(setCacheState(cacheState));

	const currentUser = await getCurrentAuthenticatedUser();

	if (currentUser != undefined) {
		store.dispatch(setCurrentUser(currentUser));
	}

	let videos = await getVideoDictionary();

	let testDirectoryRoot: IDirectoryNode = {
		type: "DIRECTORY",
		parent: null,
		slice: "$",
		subNodes: []
	}

	let nodeA: IDirectoryNode = {
		type: "DIRECTORY",
		parent: testDirectoryRoot,
		slice: "test",
		subNodes: []
	}

	let nodeB: IDirectoryNode = {
		type: "DIRECTORY",
		parent: testDirectoryRoot,
		slice: "random",
		subNodes: []
	}

	let nodeC: IDirectoryNode = {
		type: "DIRECTORY",
		parent: testDirectoryRoot,
		slice: "videos",
		subNodes: []
	}

	let nodeCA: IDirectoryNode = {
		type: "DIRECTORY",
		parent: nodeC,
		slice: "other",
		subNodes: []
	}

	let nodeCB: IDirectoryNode = {
		type: "DIRECTORY",
		parent: nodeC,
		slice: "unused",
		subNodes: []
	}

	nodeC.subNodes = [nodeCA, nodeCB]

	testDirectoryRoot.subNodes = [nodeA, nodeB, nodeC]

	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<Provider store={store}>
				<VideoDirectoryContext.Provider value={{ videoData: videos, directoryRoot: testDirectoryRoot }}>
					<RouterProvider router={createBrowserRouter(createRoutesFromElements(
						<Route path="/*" element={<PfyWrapper/>} >
							<Route path="app" element={<HomePage/>}>
								<Route path="videos" element={<VideosPage/>}/>
								<Route path="menu" element={<MenuPage/>}>
									<Route path="options/*" element={<OptionsPage/>}>
										<Route path="general" element={<GeneralPage/>}/>
										<Route path="accounts/*" element={<AccountsPage/>}/>
										<Route path="appearance/*" element={<AppearancePage/>}/>
										<Route path="debug/*" element={<DebugPage/>}/>
										<Route path="*" element={<OptionsNavigator/>}/>
									</Route>
									<Route path="help" element={<HelpPage/>}/>				
								</Route>
								<Route path="" element={<Navigate to="videos" replace/>}/>
								<Route path="error" element={<ErrorPage/>}/>
							</Route>
							<Route path="*" element={<Navigate to="app" replace/>}/>
						</Route>
					), )}/>
				</VideoDirectoryContext.Provider>
			</Provider>
		</React.StrictMode>
	);
	
	// Retrieve the current theme from storage since it cannot be loaded in initial state.
	store.dispatch(setCurrentTheme(await getCurrentTheme()));
	store.dispatch(setCustomThemes(await getCustomThemes()));
	store.dispatch(setSettingValues(await getUserSettingsStorage()));

	store.dispatch(initializeAndSetSettingsDefault());
}

await setupState();
