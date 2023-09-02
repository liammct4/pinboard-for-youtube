import { createContext, Context } from "react"
import { AppTheme } from "../lib/config/theming/colourTheme";

export interface IThemeContext {
	themes: Array<AppTheme>;
	currentTheme: AppTheme
	setCurrentTheme: (theme: AppTheme) => void;
}

export const ThemeContext: Context<IThemeContext> = createContext<IThemeContext>(null!);
