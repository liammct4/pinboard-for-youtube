import { createContext, Context } from "react"
import { IAppTheme } from "../lib/config/theming/appTheme";

export interface IThemeContext {
	themes: IAppTheme[];
	customThemes: IAppTheme[];
	currentTheme: IAppTheme;
	actions: {
		setCurrentTheme: (theme: IAppTheme) => void;
		addCustomTheme: (theme: IAppTheme) => void;
		deleteCustomTheme: (themeName: string) => void;
		setCustomThemes: (themes: IAppTheme[]) => void;
	}
}

export const ThemeContext: Context<IThemeContext> = createContext<IThemeContext>(null!);
