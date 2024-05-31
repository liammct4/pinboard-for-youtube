import { Navigate, Route, Routes } from "react-router-dom";
import { AppearancePresets } from "./Presets/AppearancePresets";
import { AppearanceCustom } from "./Custom/AppearanceCustom";
import { ThemeContext } from "../../../../context/theme";
import { addCustomTheme, deleteCustomTheme, setCurrentTheme, setCustomThemes } from "../../../../features/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { IAppTheme } from "../../../../lib/config/theming/appTheme";
import { RootState } from "../../../../app/store";
import AppPalettes from "../../../../styling/theme.json";

export function AppearancePage() {
	const dispatch = useDispatch();
	const currentTheme: IAppTheme = useSelector((state: RootState) => state.theme.currentTheme) as IAppTheme;
	const customThemes: IAppTheme[] = useSelector((state: RootState) => state.theme.customThemes);

	return (
		<>
			<ThemeContext.Provider value={{
					themes: AppPalettes,
					customThemes: customThemes, 
					currentTheme: currentTheme,
					actions: {
						setCurrentTheme: (theme: IAppTheme) => dispatch(setCurrentTheme(theme)),
						addCustomTheme: (theme: IAppTheme) => dispatch(addCustomTheme(theme)),
						deleteCustomTheme: (themeName: string) => dispatch(deleteCustomTheme(themeName)),
						setCustomThemes: (themes: IAppTheme[]) => dispatch(setCustomThemes(themes))
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
