import { Navigate, Route, Routes } from "react-router-dom";
import { AppearancePresets } from "./Presets/AppearancePresets";
import { AppearanceCustom } from "./Custom/AppearanceCustom";
import { ThemeContext } from "../../../../context/theme";
import { addCustomTheme, deleteCustomTheme, setCurrentTheme, setCustomThemes } from "../../../../features/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppTheme } from "../../../../lib/config/theming/appTheme";
import { RootState } from "../../../../app/store";
import AppPalettes from "../../../../styling/theme.json";

export function AppearancePage() {
	const dispatch = useDispatch();
	const currentTheme: AppTheme = useSelector((state: RootState) => state.theme.currentTheme) as AppTheme;
	const customThemes: Array<AppTheme> = useSelector((state: RootState) => state.theme.customThemes);
	
	return (
		<>
			<ThemeContext.Provider value={{
					themes: AppPalettes,
					customThemes: customThemes, 
					currentTheme: currentTheme,
					actions: {
						setCurrentTheme: (theme: AppTheme) => dispatch(setCurrentTheme(theme)),
						addCustomTheme: (theme: AppTheme) => dispatch(addCustomTheme(theme)),
						deleteCustomTheme: (themeName: string) => dispatch(deleteCustomTheme(themeName)),
						setCustomThemes: (themes: Array<AppTheme>) => dispatch(setCustomThemes(themes))
					}
				}}>
				<Routes>
					<Route path="presets" element={<AppearancePresets/>}/>
					<Route path="custom/" element={<Navigate to=".."/>}/>
					<Route path="custom/:id" element={<AppearanceCustom/>}/>
					<Route path="/" element={<AppearancePresets/>}/>
				</Routes>
			</ThemeContext.Provider>
		</>
	);
}
