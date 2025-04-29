import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { InputMethodType } from "../../lib/config/configurationOption";
import settingDefinitions from "./../../lib/config/settingDefinitions.json"
import { IStorage } from "../../lib/storage/storage";

export type SettingPrimitiveValue = string | number | boolean | bigint;

export type SettingOption = {
	settingName: string;
	displayName: string;
	description: string;
	inputFormat: InputMethodType
	defaultValue: string;
}

export type SettingValue = {
	settingName: string;
	value: SettingPrimitiveValue;
}

export interface ISettingsSlice {
	settingValues: SettingValue[];
}

const initialState: ISettingsSlice = {
	settingValues: []
}

export const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		updateSettingsSliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.settingValues = action.payload.userData.config.userSettings;
		},
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

export const {
	initializeAndSetSettingsDefault,
	updateSettingsSliceFromStorage,
	setSettingValues
} = settingsSlice.actions;
export default settingsSlice.reducer;
