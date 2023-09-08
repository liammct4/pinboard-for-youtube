import { AppTheme } from "../../config/theming/appTheme";
import { IStorage } from "../storage";

export interface IConfig {
	theme: AppTheme;
	customThemes: Array<AppTheme>;
}

export async function getUserConfig(): Promise<IConfig> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.user_data.config;
}
