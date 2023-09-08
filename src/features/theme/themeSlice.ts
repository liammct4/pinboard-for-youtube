import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppTheme } from "../../lib/config/theming/appTheme";
import ThemePresets from "./../../styling/theme.json"

export interface IThemeSlice {
	currentTheme: AppTheme;
	themePresets: Array<AppTheme>;
	customThemes: Array<AppTheme>;
}

const initialState: IThemeSlice = {
	// Set after storage has been initialized in main.tsx
	currentTheme: null!,
	themePresets: ThemePresets,
	customThemes: null!
}

export const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setCurrentTheme: (state, action: PayloadAction<AppTheme>) => {
			state.currentTheme = action.payload;
		},
		addCustomTheme: (state, action: PayloadAction<AppTheme>) => {
			let existingIndex = state.customThemes.findIndex(x => x.name == action.payload.name)

			if (existingIndex == -1) {
				state.customThemes.push(action.payload);
				return;
			}

			state.customThemes[existingIndex] = action.payload;
		},
		setCustomThemes: (state, action: PayloadAction<Array<AppTheme>>) => {
			state.customThemes = action.payload;
		},
		deleteCustomTheme: (state, action: PayloadAction<string>) => {
			let index = state.customThemes.findIndex(x => x.name == action.payload);
			
			state.customThemes.splice(index, 1);
		},
	}
});

export const { setCurrentTheme, addCustomTheme, setCustomThemes, deleteCustomTheme } = themeSlice.actions;
export default themeSlice.reducer;
