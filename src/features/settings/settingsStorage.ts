import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";
import { ISettingsSlice } from "./settingsSlice";

export function saveSettingsSliceToStorage(storage: IStorage, settingsSlice: ISettingsSlice) {
	storage.userData.config.userSettings = settingsSlice.settingValues;
}
