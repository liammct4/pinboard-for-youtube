import { Settings } from "../config/settings";
import { IAppTheme, ICustomTheme, ThemeID } from "../config/theming/appTheme";

export interface IConfig {
	theme: ThemeID;
	customThemes: ICustomTheme[];
	settings: Settings;
}
