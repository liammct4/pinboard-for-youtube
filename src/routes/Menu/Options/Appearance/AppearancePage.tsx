import { Navigate, Route, Routes } from "react-router-dom";
import { AppearancePresets } from "./Presets/AppearancePresets";
import { AppearanceCustom } from "./Custom/AppearanceCustom";

export function AppearancePage() {
	return (
		<Routes>
			<Route path="presets" element={<AppearancePresets/>}/>
			<Route path="custom/" element={<Navigate to=".."/>}/>
			<Route path="custom/:id" element={<AppearanceCustom/>}/>
			<Route path="/" element={<AppearancePresets/>}/>
		</Routes>
	);
}
