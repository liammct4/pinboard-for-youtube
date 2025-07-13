import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ICustomTheme, ThemeID } from "../../lib/config/theming/appTheme";
import { IStorage } from "../../lib/storage/storage";
import { DEFAULT_THEME } from "../../styling/themes";

export interface IThemeSlice {
	currentTheme: ThemeID;
	customThemes: ICustomTheme[];
}

const initialState: IThemeSlice = {
	currentTheme: DEFAULT_THEME,
	customThemes: []
};

export const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		updateThemeSliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.currentTheme = action.payload.userData.config.theme;
			state.customThemes = action.payload.userData.config.customThemes;
		},
		setCurrentTheme: (state, action: PayloadAction<ThemeID>) => {
			state.currentTheme = action.payload;
		},
		addCustomTheme: (state, action: PayloadAction<ICustomTheme>) => {
			let existingIndex = state.customThemes.findIndex(x => x.id == action.payload.id)

			if (existingIndex == -1) {
				state.customThemes.push(action.payload);
				return;
			}

			state.customThemes[existingIndex] = action.payload;
		},
		setCustomThemes: (state, action: PayloadAction<ICustomTheme[]>) => {
			state.customThemes = action.payload;
		},
		deleteCustomTheme: (state, action: PayloadAction<ThemeID>) => {
			let index = state.customThemes.findIndex(x => x.id == action.payload);
			
			state.customThemes.splice(index, 1);

			if (action.payload == state.currentTheme) {
				state.currentTheme = DEFAULT_THEME;
			}
		},
		setCustomThemesWithoutQueue: (state, action: PayloadAction<ICustomTheme[]>) => {
			state.customThemes = action.payload;
		}
	}
});

export const themeActions = themeSlice.actions;
