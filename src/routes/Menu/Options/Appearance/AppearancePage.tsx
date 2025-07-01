import { Navigate, Route, Routes } from "react-router-dom";
import { AppearancePresets } from "./Presets/AppearancePresets";
import { AppearanceCustom } from "./Custom/AppearanceCustom";
import { themeActions } from "../../../../features/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { IAppTheme } from "../../../../lib/config/theming/appTheme";
import { RootState } from "../../../../app/store";

export function AppearancePage() {
	const dispatch = useDispatch();

	return (
		<Routes>
			<Route path="presets" element={<AppearancePresets/>}/>
			<Route path="custom/" element={<Navigate to=".."/>}/>
			<Route path="custom/:id" element={<AppearanceCustom/>}/>
			<Route path="/" element={<AppearancePresets/>}/>
		</Routes>
	);
}
