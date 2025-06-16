import { Settings } from "../config/settings";
import { IAppTheme } from "../config/theming/appTheme";

export interface IConfig {
	theme: IAppTheme;
	customThemes: IAppTheme[];
	settings: Settings;
}
