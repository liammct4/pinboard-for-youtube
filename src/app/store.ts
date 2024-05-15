import { configureStore } from "@reduxjs/toolkit"
import videoReducer from "../features/videos/videoSlice.ts"
import tempStateReducer from "../features/state/tempStateSlice.ts"
import tempStateMiddleware from "../features/state/stateStorageMiddleware.ts"
import videoStorageMiddleware from "../features/videos/videoStorageMiddleware.ts"
import tagStorageMiddleware from "../features/videos/tagStorageUpdateMiddleware.ts"
import tagCascadeUpdateMiddleware from "../features/videos/tagCascadeUpdateMiddleware.ts"
import themeMiddleware from "../features/theme/themeMiddleware.ts"
import themeReducer from "../features/theme/themeSlice.ts"
import authStorageMiddleware from "../features/auth/authStorageMiddleware.ts"
import authSlice from "../features/auth/authSlice.ts"
import videoQueueSyncVideoMiddleware from "../features/videos/videoQueueSyncVideoMiddleware.ts"
import accountSlice from "../features/account/accountSlice.ts"
import accountCloudSyncMiddleware from "../features/account/accountCloudSyncMiddleware.ts"
import authAccountDataMiddleware from "../features/auth/authAccountDataMiddleware.ts"
import tagQueueSyncMiddleware from "../features/videos/tagQueueSyncMiddleware.ts"

export let store = configureStore({
	reducer: {
		video: videoReducer,
		tempState: tempStateReducer,
		theme: themeReducer,
		auth: authSlice,
		account: accountSlice
	},
	devTools: true,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
		.prepend(videoStorageMiddleware.middleware)
		.prepend(videoQueueSyncVideoMiddleware.middleware)
		.prepend(tagQueueSyncMiddleware.middleware)
		.prepend(tagCascadeUpdateMiddleware.middleware)
		.prepend(tagStorageMiddleware.tagStorageUpdateUpdateMiddleware.middleware)
		.prepend(tagStorageMiddleware.tagFilterUpdateMiddleware.middleware)
		.prepend(tagCascadeUpdateMiddleware.middleware)
		.prepend(tempStateMiddleware.addIDMiddleware.middleware)
		.prepend(tempStateMiddleware.removeIDMiddleware.middleware)
		.prepend(tempStateMiddleware.layoutStateUpdateMiddleware.middleware)
		.prepend(themeMiddleware.updateThemeMiddleware.middleware)
		.prepend(themeMiddleware.updateStorageMiddleware.middleware)
		.prepend(themeMiddleware.updateCustomThemeStorageMiddleware.middleware)
		.prepend(authStorageMiddleware.authChangeUserStorageMiddleware.middleware)
		.prepend(authStorageMiddleware.authTokenChangedMiddleware.middleware)
		.prepend(accountCloudSyncMiddleware.middleware)
		.prepend(authAccountDataMiddleware.authAccountDataMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
