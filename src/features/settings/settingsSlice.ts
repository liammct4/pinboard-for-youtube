import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { InputMethodType } from "../../lib/config/configurationOption";
import settingDefinitions from "./../../lib/config/settingDefinitions.json"

export type SettingOption = {
	settingName: string;
	displayName: string;
	description: string;
	inputFormat: InputMethodType
	defaultValue: string;
}

export type SettingValue = {
	settingName: string;
	value: string;
}

export interface ISettingsSlice {
	settingValues: SettingValue[]
}

const initialState: ISettingsSlice = {
	settingValues: []
}

export const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		initializeAndSetSettingsDefault: (state) => {
			for (let settingDefinition of settingDefinitions) {
				let index = state.settingValues.findIndex(value => value.settingName == settingDefinition.settingName);

				// Means theres no corresponding value, so set to default.
				if (index == -1) {
					state.settingValues.push({
						settingName: settingDefinition.settingName,
						value: settingDefinition.defaultValue
					})
				}
			}
		},
		setSettingValues: (state, action: PayloadAction<SettingValue[]>) => {
			state.settingValues = action.payload;
		}
	}
})

export const { initializeAndSetSettingsDefault, setSettingValues } = settingsSlice.actions;
export default settingsSlice.reducer;
