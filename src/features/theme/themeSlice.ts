import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppTheme } from "../../lib/config/theming/colourTheme";
import ThemePresets from "./../../styling/theme.json"

export interface IThemeSlice {
	currentTheme: AppTheme,
	themePresets: Array<AppTheme>
}

const initialState: IThemeSlice = {
	// Set after storage has been initialized in main.tsx
	currentTheme: null!,
	themePresets: ThemePresets
}

export const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setCurrentTheme: (state, action: PayloadAction<AppTheme>) => {
			state.currentTheme = action.payload;
		},
	}
});

export const { setCurrentTheme } = themeSlice.actions;
export default themeSlice.reducer;
