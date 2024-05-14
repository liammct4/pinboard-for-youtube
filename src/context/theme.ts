import { createContext, Context } from "react"
import { AppTheme } from "../lib/config/theming/appTheme";

export interface IThemeContext {
	themes: AppTheme[];
	customThemes: AppTheme[];
	currentTheme: AppTheme;
	actions: {
		setCurrentTheme: (theme: AppTheme) => void;
		addCustomTheme: (theme: AppTheme) => void;
		deleteCustomTheme: (themeName: string) => void;
		setCustomThemes: (themes: AppTheme[]) => void;
	}
}

export const ThemeContext: Context<IThemeContext> = createContext<IThemeContext>(null!);
