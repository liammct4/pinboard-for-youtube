import React from "react"
import ReactDOM from "react-dom/client"
import { store } from "./app/store.js"
import { Provider } from "react-redux"
import { getActiveTabURL } from "./lib/browser/page.ts"
import { accessStorage, ensureInitialized, IStorage, modifyStorage } from "./lib/storage/storage.ts"
import { getVideoIdFromYouTubeLink, doesVideoExist } from "./lib/util/youtube/youtubeUtil.ts"
import { IStateSlice, setTempState } from "./features/state/tempStateSlice.ts"
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
import { setCurrentTheme, setCustomThemes } from "./features/theme/themeSlice.ts"
import { DebugPage } from "./routes/Menu/Options/Debug/DebugPage.tsx"
import { setCurrentUser } from "./features/auth/authSlice.ts"
import { PfyWrapper } from "./routes/PfyWrapper.tsx"
import { initializeAndSetSettingsDefault, setSettingValues } from "./features/settings/settingsSlice.ts"
import { ErrorPage } from "./routes/ErrorPage/ErrorPage.tsx"
import { ICacheSlice, setCacheState } from "./features/cache/cacheSlice.ts"
import { checkAndImplementLocalStorage } from "./lib/browser/features/localStorage.ts"
import { sampleVideoData } from "./../testData/testDataSet.ts";
import { IDirectoryNode, IVideoNode } from "./components/video/navigation/directory.ts"
import { IVideo } from "./lib/video/video.ts"
import "./../public/common-definitions.css"
import "./../public/globals.css"
import "./main.css"
import { removeParentPass } from "./lib/storage/userData/userData.ts"

checkAndImplementLocalStorage();

async function setupState() {
	await ensureInitialized();

	let activeID: string | undefined = undefined;

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

	let storage: IStorage = await accessStorage();

	let tempState: IStateSlice = {
		expandedVideoIDs: storage.temp_state.expandedVideos,
		layout: storage.temp_state.layout,
		temporarySingleState: {
			onRequestIsVideoControlLocked: false
		}
	}

	let cacheState: ICacheSlice = {
		videoCache: storage.cache.videos
	};

	store.dispatch(setTempState(tempState));
	store.dispatch(setCacheState(cacheState));

	const currentUser = storage.auth.currentUser;

	if (currentUser != undefined) {
		store.dispatch(setCurrentUser(currentUser));
	}

	let videos = new Map<string, IVideo>(storage.user_data.videos.map(x => [x.id, x]));

	let testDirectoryRoot: IDirectoryNode = {
		nodeID: crypto.randomUUID(),
		type: "DIRECTORY",
		parent: null,
		slice: "$",
		subNodes: []
	}

	let nodeA: IDirectoryNode = {
		nodeID: crypto.randomUUID(),
		type: "DIRECTORY",
		parent: testDirectoryRoot,
		slice: "test",
		subNodes: []
	}

	let nodeB: IDirectoryNode = {
		nodeID: crypto.randomUUID(),
		type: "DIRECTORY",
		parent: testDirectoryRoot,
		slice: "random",
		subNodes: []
	}

	let nodeC: IDirectoryNode = {
		nodeID: crypto.randomUUID(),
		type: "DIRECTORY",
		parent: testDirectoryRoot,
		slice: "videos",
		subNodes: []
	}

	let nodeD: IDirectoryNode = { ...nodeC, nodeID: crypto.randomUUID(), slice: "other" };
	let nodeE: IDirectoryNode = { ...nodeC, nodeID: crypto.randomUUID(), slice: "stuff" };
	let nodeF: IDirectoryNode = { ...nodeC, nodeID: crypto.randomUUID(), slice: "tutorial" };
	let nodeG: IDirectoryNode = { ...nodeC, nodeID: crypto.randomUUID(), slice: "folder" };
	let nodeH: IDirectoryNode = { ...nodeC, nodeID: crypto.randomUUID(), slice: "directory" };

	let nodeCA: IDirectoryNode = {
		nodeID: crypto.randomUUID(),
		type: "DIRECTORY",
		parent: nodeC,
		slice: "other",
		subNodes: []
	}

	let nodeCB: IDirectoryNode = {
		nodeID: crypto.randomUUID(),
		type: "DIRECTORY",
		parent: nodeC,
		slice: "unused",
		subNodes: []
	}

	let videoA: IVideoNode = {
		nodeID: crypto.randomUUID(),
		type: "VIDEO",
		parent: testDirectoryRoot,
		videoID: sampleVideoData[0].id
	}

	let videoB: IVideoNode = {
		nodeID: crypto.randomUUID(),
		type: "VIDEO",
		parent: testDirectoryRoot,
		videoID: sampleVideoData[1].id
	}

	videos.set(videoA.videoID, sampleVideoData[0]);
	videos.set(videoB.videoID, sampleVideoData[1]);

	nodeC.subNodes = [nodeCA, nodeCB]

	testDirectoryRoot.subNodes = [nodeA, nodeB, nodeC, nodeD, nodeE, nodeF, nodeG, nodeH, videoA, videoB];

	await modifyStorage(s => {
		s.user_data.videos = Array.from(videos.values());
		s.user_data.directoryRoot = removeParentPass(testDirectoryRoot);
		s.youtubeInjector.activeVideoID = activeID;
	});

	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<Provider store={store}>
				<RouterProvider router={createBrowserRouter(createRoutesFromElements(
					<Route path="/*" element={<PfyWrapper/>}>
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
				))}/>
			</Provider>
		</React.StrictMode>
	);
	
	// Retrieve the current theme from storage since it cannot be loaded in initial state.
	store.dispatch(setCurrentTheme(storage.user_data.config.theme));
	store.dispatch(setCustomThemes(storage.user_data.config.customThemes));
	store.dispatch(setSettingValues(storage.user_data.config.userSettings));

	store.dispatch(initializeAndSetSettingsDefault());
}

await setupState();
