import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IAppTheme, ThemeID } from "../../lib/config/theming/appTheme";
import { AppThemes, AppThemesArray } from "../../styling/themes";
import { useMemo } from "react";

export function useTheme() {
	const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
	const customThemes = useSelector((state: RootState) => state.theme.customThemes);
	const allThemes = useMemo(() => [ ...AppThemesArray, ...customThemes ], [customThemes]);

	const retrieve = (theme: ThemeID) => {
		if (AppThemes[theme] != undefined) {
			return AppThemes[theme];
		}

		return customThemes.find(t => t.id == theme) as IAppTheme;
	}

	return {
		currentTheme,
		currentThemeData: retrieve(currentTheme),
		retrieveThemeData: retrieve,
		customThemes,
		allThemes
	}
}
