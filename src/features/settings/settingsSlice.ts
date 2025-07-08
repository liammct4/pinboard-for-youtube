import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IPrimaryStorage } from "../../lib/storage/storage";
import { defaultSettings, Settings } from "../../lib/config/settings";

export interface ISettingsSlice {
	settings: Settings;
}

const initialState: ISettingsSlice = {
	settings: defaultSettings
}

export const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		updateSettingsSliceFromStorage: (state, action: PayloadAction<IPrimaryStorage>) => {
			state.settings = action.payload.userData.config.settings;
		},
		initializeAndSetSettingsDefault: (state) => {
			state.settings = defaultSettings;
		},
		setSettings: (state, action: PayloadAction<Settings>) => {
			state.settings = action.payload;
		}
	}
})

export const settingsActions = settingsSlice.actions;
