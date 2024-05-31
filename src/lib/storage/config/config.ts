import { SettingValue } from "../../../features/settings/settingsSlice";
import { IAppTheme } from "../../config/theming/appTheme";
import { IStorage } from "../storage";

export interface IConfig {
	theme: IAppTheme;
	customThemes: IAppTheme[];
	userSettings: SettingValue[];
}

export async function getUserSettingsStorage(): Promise<SettingValue[]> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.user_data.config.userSettings;
}

export async function setUserSettingsStorage(newSettings: SettingValue[]): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	storage.user_data.config.userSettings = newSettings;

	await chrome.storage.local.set(storage);
}
