import { AppTheme } from "../../../config/theming/appTheme";
import { IStorage } from "../../storage";

/**
 * Gets the current theme from storage.
 * @returns The theme set in the user config from local storage.
 */
export async function getCurrentTheme(): Promise<AppTheme> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.user_data.config.theme;
}

export async function getCustomThemes(): Promise<AppTheme[]> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.user_data.config.customThemes;
}

/**
 * Sets the current theme in the user config in extension local storage.
 * @param theme The new current theme.
 */
export async function setStorageTheme(theme: AppTheme): Promise<void> {
	let storage = await chrome.storage.local.get() as IStorage;
	storage.user_data.config.theme = theme;

	await chrome.storage.local.set({ "user_data": storage.user_data });
}

/**
 * Sets the user custom themes in the user config in extension local storage.
 * @param theme The new custom themes.
 */
export async function setStorageCustomThemes(themes: AppTheme[]): Promise<void> {
	let storage = await chrome.storage.local.get() as IStorage;
	storage.user_data.config.customThemes = themes;

	await chrome.storage.local.set({ "user_data": storage.user_data });
}
