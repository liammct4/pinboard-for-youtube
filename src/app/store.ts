import { configureStore } from "@reduxjs/toolkit"
import { mutationRequestMiddleware } from "../features/mutation/mutationRequestMiddleware.ts"
import { addVideoMiddleware } from "../features/directory/directoryAccountMiddleware.ts"
import { tempStateSlice } from "../features/state/tempStateSlice.ts";
import { themeSlice } from "../features/theme/themeSlice.ts";
import { authSlice } from "../features/auth/authSlice.ts";
import { settingsSlice } from "../features/settings/settingsSlice.ts";
import { cacheSlice } from "../features/cache/cacheSlice.ts";
import { mutationSlice } from "../features/mutation/mutationSlice.ts";
import { videoSlice } from "../features/video/videoSlice.ts";
import { directorySlice } from "../features/directory/directorySlice.ts";

export let store = configureStore({
	reducer: {
		tempState: tempStateSlice.reducer,
		theme: themeSlice.reducer,
		auth: authSlice.reducer,
		settings: settingsSlice.reducer,
		cache: cacheSlice.reducer,
		mutation: mutationSlice.reducer,
		video: videoSlice.reducer,
		directory: directorySlice.reducer
	},
	devTools: true,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
		.prepend(mutationRequestMiddleware.middleware)
		.prepend(addVideoMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
