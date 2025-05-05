import React from "react"
import ReactDOM from "react-dom/client"
import { store } from "./app/store.js"
import { Provider } from "react-redux"
import { getActiveTabURL } from "./lib/browser/page.ts"
import { accessStorage, ensureInitialized, IStorage, modifyStorage } from "./lib/storage/storage.ts"
import { getVideoIdFromYouTubeLink, doesVideoExist } from "./lib/util/youtube/youtubeUtil.ts"
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
import { DebugPage } from "./routes/Menu/Options/Debug/DebugPage.tsx"
import { PfyWrapper } from "./routes/PfyWrapper.tsx"
import { ErrorPage } from "./routes/ErrorPage/ErrorPage.tsx"
import { checkAndImplementLocalStorage } from "./lib/browser/features/localStorage.ts"
import { sampleVideoData } from "./../testData/testDataSet.ts";
import { IVideo } from "./lib/video/video.ts"
import { setupStorageAndStoreSync, syncStoreToStorage } from "./app/setup.ts"
import "./../public/common-definitions.css"
import "./../public/globals.css"
import "./main.css"
import { directoryActions } from "./features/directory/directorySlice.ts"
import { parsePath } from "./lib/directory/path.ts"
import { videoActions } from "./features/video/videoSlice.ts"

checkAndImplementLocalStorage();

async function setupState() {
	await ensureInitialized();
	setupStorageAndStoreSync();

	let activeID: string | undefined = undefined;
	let storage: IStorage = await accessStorage();

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

		store.dispatch(directoryActions.createDirectoryNode({ parentPath: "$", slice: "test" }));
		store.dispatch(directoryActions.createDirectoryNode({ parentPath: "$", slice: "random" }));
		store.dispatch(directoryActions.createVideoNode({ parentPath: "$", videoID: sampleVideoData[0].id, videoData: [] }));
		store.dispatch(directoryActions.createVideoNode({ parentPath: "$", videoID: sampleVideoData[1].id, videoData: [] }));

		store.dispatch(videoActions.addVideo(sampleVideoData[0]));
		store.dispatch(videoActions.addVideo(sampleVideoData[1]));
	}

	syncStoreToStorage();

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
}

await setupState();
