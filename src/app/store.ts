import { configureStore } from "@reduxjs/toolkit"
import videoReducer from "../features/videos/videoSlice.ts"
import tempStateReducer from "../features/state/tempStateSlice.ts"
import themeReducer from "../features/theme/themeSlice.ts"
import authSlice from "../features/auth/authSlice.ts"
import accountSlice from "../features/account/accountSlice.ts"
import settingsSlice from "../features/settings/settingsSlice.ts"
import cacheSlice from "../features/cache/cacheSlice.ts"
import { videoStorageMiddleware } from "../features/videos/videoStorageMiddleware.ts"
import { tagCascadeUpdateMiddleware } from "../features/videos/tagCascadeUpdateMiddleware.ts"
import { videoQueueSyncVideoMiddleware } from "../features/videos/videoQueueSyncVideoMiddleware.ts"
import { accountCloudSyncMiddleware } from "../features/account/accountCloudSyncMiddleware.ts"
import { authAccountDataMiddleware } from "../features/auth/authAccountDataMiddleware.ts"
import { tagQueueSyncMiddleware } from "../features/videos/tagQueueSyncMiddleware.ts"
import { settingsStorageMiddleware } from "../features/settings/settingsStorageMiddleware.ts"
import { themeQueueSyncMiddleware } from "../features/theme/themeQueueSyncMiddleware.ts"
import { tagFilterUpdateMiddleware, tagStorageUpdateUpdateMiddleware } from "../features/videos/tagStorageUpdateMiddleware.ts"
import { addIDMiddleware, layoutStateUpdateMiddleware, removeIDMiddleware } from "../features/state/stateStorageMiddleware.ts"
import { updateCustomThemeStorageMiddleware, updateStorageMiddleware, updateThemeMiddleware } from "../features/theme/themeMiddleware.ts"
import { authChangeUserStorageMiddleware, authTokenChangedMiddleware } from "../features/auth/authStorageMiddleware.ts"
import { cacheSaveStorageMiddleware } from "../features/cache/cacheSaveStorageMiddleware.ts"

export let store = configureStore({
	reducer: {
		video: videoReducer,
		tempState: tempStateReducer,
		theme: themeReducer,
		auth: authSlice,
		account: accountSlice,
		settings: settingsSlice,
		cache: cacheSlice
	},
	devTools: true,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
		.prepend(videoStorageMiddleware.middleware)
		.prepend(videoQueueSyncVideoMiddleware.middleware)
		.prepend(tagQueueSyncMiddleware.middleware)
		.prepend(tagCascadeUpdateMiddleware.middleware)
		.prepend(tagStorageUpdateUpdateMiddleware.middleware)
		.prepend(tagFilterUpdateMiddleware.middleware)
		.prepend(tagCascadeUpdateMiddleware.middleware)
		.prepend(addIDMiddleware.middleware)
		.prepend(removeIDMiddleware.middleware)
		.prepend(layoutStateUpdateMiddleware.middleware)
		.prepend(updateThemeMiddleware.middleware)
		.prepend(updateStorageMiddleware.middleware)
		.prepend(themeQueueSyncMiddleware.middleware)
		.prepend(updateCustomThemeStorageMiddleware.middleware)
		.prepend(authChangeUserStorageMiddleware.middleware)
		.prepend(authTokenChangedMiddleware.middleware)
		.prepend(accountCloudSyncMiddleware.middleware)
		.prepend(authAccountDataMiddleware.middleware)
		.prepend(settingsStorageMiddleware.middleware)
		.prepend(cacheSaveStorageMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
