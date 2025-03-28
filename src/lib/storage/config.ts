import { SettingValue } from "../../features/settings/settingsSlice";
import { IAppTheme } from "../config/theming/appTheme";

export interface IConfig {
	theme: IAppTheme;
	customThemes: IAppTheme[];
	userSettings: SettingValue[];
}
