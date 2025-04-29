import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAppTheme } from "../../lib/config/theming/appTheme";
import ThemePresets from "./../../styling/theme.json"
import { IStorage } from "../../lib/storage/storage";

export interface IThemeSlice {
	currentTheme: IAppTheme;
	themePresets: IAppTheme[];
	customThemes: IAppTheme[];
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
		updateThemeSliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.currentTheme = action.payload.userData.config.theme;
			state.customThemes = action.payload.userData.config.customThemes;
		},
		setCurrentTheme: (state, action: PayloadAction<IAppTheme>) => {
			state.currentTheme = action.payload;
		},
		addCustomTheme: (state, action: PayloadAction<IAppTheme>) => {
			let existingIndex = state.customThemes.findIndex(x => x.id == action.payload.id)

			if (existingIndex == -1) {
				state.customThemes.push(action.payload);
				return;
			}

			state.customThemes[existingIndex] = action.payload;
		},
		setCustomThemes: (state, action: PayloadAction<IAppTheme[]>) => {
			state.customThemes = action.payload;
		},
		deleteCustomTheme: (state, action: PayloadAction<string>) => {
			let index = state.customThemes.findIndex(x => x.id == action.payload);
			
			state.customThemes.splice(index, 1);
		},
		setCustomThemesWithoutQueue: (state, action: PayloadAction<IAppTheme[]>) => {
			state.customThemes = action.payload;
		}
	}
});

export const {
	setCurrentTheme,
	addCustomTheme,
	setCustomThemes,
	deleteCustomTheme,
	setCustomThemesWithoutQueue,
	updateThemeSliceFromStorage
} = themeSlice.actions;
export default themeSlice.reducer;
