import { configureStore } from "@reduxjs/toolkit"
import { tempStateSlice } from "../features/state/tempStateSlice.ts";
import { themeSlice } from "../features/theme/themeSlice.ts";
import { authSlice } from "../features/auth/authSlice.ts";
import { settingsSlice } from "../features/settings/settingsSlice.ts";
import { cacheSlice } from "../features/cache/cacheSlice.ts";
import { videoSlice } from "../features/video/videoSlice.ts";
import { directorySlice } from "../features/directory/directorySlice.ts";
import { authSyncStorageMiddleware } from "../features/auth/authStorage.ts";
import { cacheSyncStorageMiddleware } from "../features/cache/cacheStorage.ts";
import { directorySyncStorageMiddleware } from "../features/directory/directoryStorage.ts";
import { settingsSyncStorageMiddleware } from "../features/settings/settingsStorage.ts";
import { tempStateSyncStorageMiddleware } from "../features/state/tempStateStorage.ts";
import { videoSyncStorageMiddleware } from "../features/video/videoStorage.ts";

export let store = configureStore({
	reducer: {
		tempState: tempStateSlice.reducer,
		theme: themeSlice.reducer,
		auth: authSlice.reducer,
		settings: settingsSlice.reducer,
		cache: cacheSlice.reducer,
		video: videoSlice.reducer,
		directory: directorySlice.reducer
	},
	devTools: true,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
		.prepend(authSyncStorageMiddleware.middleware)
		.prepend(cacheSyncStorageMiddleware.middleware)
		.prepend(directorySyncStorageMiddleware.middleware)
		.prepend(settingsSyncStorageMiddleware.middleware)
		.prepend(tempStateSyncStorageMiddleware.middleware)
		.prepend(videoSyncStorageMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
