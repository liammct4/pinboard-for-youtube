import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppTheme } from "../../lib/config/theming/appTheme";
import ThemePresets from "./../../styling/theme.json"

export interface IThemeSlice {
	currentTheme: AppTheme;
	themePresets: AppTheme[];
	customThemes: AppTheme[];
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
			let existingIndex = state.customThemes.findIndex(x => x.id == action.payload.id)

			if (existingIndex == -1) {
				state.customThemes.push(action.payload);
				return;
			}

			state.customThemes[existingIndex] = action.payload;
		},
		setCustomThemes: (state, action: PayloadAction<AppTheme[]>) => {
			state.customThemes = action.payload;
		},
		deleteCustomTheme: (state, action: PayloadAction<string>) => {
			let index = state.customThemes.findIndex(x => x.id == action.payload);
			
			state.customThemes.splice(index, 1);
		},
		setCustomThemesWithoutQueue: (state, action: PayloadAction<AppTheme[]>) => {
			state.customThemes = action.payload;
		}
	}
});

export const { setCurrentTheme, addCustomTheme, setCustomThemes, deleteCustomTheme, setCustomThemesWithoutQueue } = themeSlice.actions;
export default themeSlice.reducer;
