import { Settings } from "../config/settings";
import { ICustomTheme, ThemeID } from "../config/theming/appTheme";

export interface IConfig {
	theme: ThemeID;
	customThemes: ICustomTheme[];
	settings: Settings;
}
