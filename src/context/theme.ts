import { createContext, Context } from "react"
import { AppTheme } from "../lib/config/theming/appTheme";

export interface IThemeContext {
	themes: Array<AppTheme>;
	customThemes: Array<AppTheme>;
	currentTheme: AppTheme;
	actions: {
		setCurrentTheme: (theme: AppTheme) => void;
		addCustomTheme: (theme: AppTheme) => void;
		deleteCustomTheme: (theme: string) => void;
		setCustomThemes: (themes: Array<AppTheme>) => void;
	}
}

export const ThemeContext: Context<IThemeContext> = createContext<IThemeContext>(null!);
