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
import { IDirectoryNode, IVideoNode } from "./components/video/navigation/directory.ts"
import { IVideo } from "./lib/video/video.ts"
import { removeParentPass } from "./lib/storage/userData/userData.ts"
import { setupStorageAndStoreSync, syncStoreToStorage } from "./app/setup.ts"
import { StorageWrapper } from "./components/features/storage/StorageWrapper.tsx"
import { VideoWrapper } from "./components/features/videoAccess/VideoWrapper.tsx"
import "./../public/common-definitions.css"
import "./../public/globals.css"
import "./main.css"

checkAndImplementLocalStorage();

async function setupState() {
	await ensureInitialized();
	setupStorageAndStoreSync();

	let activeID: string | undefined = undefined;

	let storage: IStorage = await accessStorage();
	let videos = new Map<string, IVideo>(storage.userData.videos.map(x => [x.id, x]));

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
		
		testDirectoryRoot.subNodes = [nodeA, nodeB, videoA, videoB];

		await modifyStorage(s => {
			s.userData.videos = Array.from(videos.values());
			s.userData.directoryRoot = removeParentPass(testDirectoryRoot)
		});
	}

	syncStoreToStorage();

	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<StorageWrapper startValue={storage}>
				<VideoWrapper>
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
				</VideoWrapper>
			</StorageWrapper>
		</React.StrictMode>
	);
}

await setupState();
