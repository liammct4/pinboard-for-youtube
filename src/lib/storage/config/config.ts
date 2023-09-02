import { AppTheme } from "../../config/theming/colourTheme";
import { IStorage } from "../storage";

export interface IConfig {
	theme: AppTheme
}

export async function getUserConfig(): Promise<IConfig> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.user_data.config;
}
