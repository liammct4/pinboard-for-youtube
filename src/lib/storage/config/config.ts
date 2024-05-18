import { SettingValue } from "../../../features/settings/settingsSlice";
import { AppTheme } from "../../config/theming/appTheme";
import { IStorage } from "../storage";

export interface IConfig {
	theme: AppTheme;
	customThemes: AppTheme[];
	userSettings: SettingValue[];
}

export async function getUserSettingsStorage(): Promise<SettingValue[]> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.user_data.config.userSettings;
}
