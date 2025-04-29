import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";
import { IThemeSlice } from "./themeSlice";

export function saveThemeSliceToStorage(storage: IStorage, themeSlice: IThemeSlice) {
	storage.userData.config.customThemes = themeSlice.customThemes;
	storage.userData.config.theme = themeSlice.currentTheme;
}
