import { Route, Routes } from "react-router-dom";
import { AppearancePresets } from "./Presets/AppearancePresets";
import { AppearanceCustom } from "./Custom/AppearanceCustom";
import { ThemeContext } from "../../../../context/theme";
import { setCurrentTheme } from "../../../../features/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppTheme } from "../../../../lib/config/theming/colourTheme";
import { RootState } from "../../../../app/store";
import AppPalettes from "../../../../styling/theme.json";

export function AppearancePage() {
	const dispatch = useDispatch();
	const currentTheme: AppTheme = useSelector((state: RootState) => state.theme.currentTheme) as AppTheme;
	const setTheme = (theme: AppTheme) => dispatch(setCurrentTheme(theme));
	
	return (
		<>
			<ThemeContext.Provider value={{ themes: AppPalettes, currentTheme: currentTheme, setCurrentTheme: setTheme }}>
				<Routes>
					<Route path="presets" element={<AppearancePresets/>}/>
					<Route path="custom" element={<AppearanceCustom/>}/>
					<Route path="/" element={<AppearancePresets/>}/>
				</Routes>
			</ThemeContext.Provider>
		</>
	);
}
