import React from "react"
import ReactDOM from "react-dom/client"
import { store } from "./app/store.js"
import { Provider } from "react-redux"
import { getActiveTabURL } from "./lib/browser/page.ts"
import { ensureInitialized, getApplicationContextType } from "./lib/storage/storage.ts"
import { getVideoIdFromYouTubeLink, doesVideoExist } from "./lib/util/youtube/youtubeUtil.ts"
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { VideosPage } from "./routes/Videos/VideosPage.tsx"
import { MenuPage } from "./routes/Menu/MenuPage.tsx"
import { OptionsPage } from "./routes/Menu/Options/OptionsPage.tsx"
import { GeneralPage } from "./routes/Menu/Options/General/GeneralPage.tsx"
import { AppearancePage } from "./routes/Menu/Options/Appearance/AppearancePage.tsx"
import { AccountsPage } from "./routes/Menu/Options/Accounts/AccountsPage.tsx"
import { OptionsNavigator } from "./routes/Menu/Options/OptionsNavigator.tsx"
import { DebugPage } from "./routes/Menu/Options/Debug/DebugPage.tsx"
import { ErrorPage } from "./routes/ErrorPage/ErrorPage.tsx"
import { createTestUserData, sampleCacheData, sampleVideoData } from "./../testData/testDataSet.ts";
import { setupStorageAndStoreSync, syncStoreToStorage } from "./app/setup.ts"
import "./../public/common-definitions.css"
import "./../public/globals.css"
import "./main.css"
import { directoryActions } from "./features/directory/directorySlice.ts"
import { videoActions } from "./features/video/videoSlice.ts"
import { cacheActions } from "./features/cache/cacheSlice.ts"
import { DataPage } from "./routes/Menu/Options/Data/DataPage.tsx"
import { ClosePage } from "./routes/Menu/Options/ClosePage/ClosePage.tsx"
import { PfyWrapper } from "./routes/PfyWrapper/PfyWrapper.tsx"
import { HomePage } from "./routes/HomePage/HomePage.tsx"
import { HelpPage } from "./routes/Menu/HelpPage/HelpPage.tsx"

async function initializeExtension() {
	await ensureInitialized();
	setupStorageAndStoreSync();
	
	await syncStoreToStorage(false);

	let environment = getApplicationContextType();

	if (environment == "EXTENSION") {
		let currentUrl: string | undefined = await getActiveTabURL();

		if (currentUrl != undefined && await doesVideoExist(currentUrl)) {
			// If an error happens, it means that the current page is not a youtube video.
			let activeID = getVideoIdFromYouTubeLink(currentUrl);

			if (activeID.success) {
				store.dispatch(videoActions.changeActiveVideoID(activeID.result as string));
			}
		}
	}
	else if (environment == "DEVMODE") {
		createTestUserData();
	}

	const errorPageDebug = false; 
	let errorPage: (() => React.ReactNode) | undefined = undefined;

	if (errorPageDebug || getApplicationContextType() == "EXTENSION") {
		errorPage = ErrorPage;
	}

	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<Provider store={store}>
				<RouterProvider router={createBrowserRouter(createRoutesFromElements(
					<Route path="/*" element={<PfyWrapper/>}>
						<Route path="app" element={<HomePage/>} >
							<Route path="videos" element={<VideosPage/>} ErrorBoundary={errorPage}/>
							<Route path="menu" element={<MenuPage/>} ErrorBoundary={errorPage}>
								<Route path="options/*" element={<OptionsPage/>}>
									<Route path="general" element={<GeneralPage/>}/>
									<Route path="data" element={<DataPage/>}/>
									<Route path="accounts/*" element={<AccountsPage/>}/>
									<Route path="appearance/*" element={<AppearancePage/>}/>
									<Route path="debug/*" element={<DebugPage/>}/>
									<Route path="*" element={<OptionsNavigator/>}/>
									<Route path="help" element={<HelpPage/>}/>				
								</Route>
							</Route>
							<Route path="" element={<Navigate to="videos" replace/>} ErrorBoundary={errorPage}/>
						</Route>
						<Route path="close" element={<ClosePage/>}/>
						<Route path="*" element={<Navigate to="app" replace/>}/>
					</Route>
				))}/>
			</Provider>
		</React.StrictMode>
	);
}

await initializeExtension();
