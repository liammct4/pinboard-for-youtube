import { GUID } from "../../util/objects/types";

export type ThemeID = `${GUID}:THEME`;
export interface IAppTheme {
	id: ThemeID;
	name: string;
	palette: ColourPalette;
}

export interface ICustomTheme extends IAppTheme {
	basedOn: ThemeID;
}

export type ColourPaletteColours = 
	"primary-common" |
	"primary-faded" |
	"primary-dark" |
	"primary-ultradark" |
	"empty-01-normal" |
	"empty-01-raised" |
	"empty-01-depth" |
	"empty-01-shadow" |
	"empty-02-normal" |
	"empty-02-raised" |
	"empty-02-depth" |
	"empty-02-shadow" |
	"text-strong" |
	"text-normal" |
	"text-light" |
	"text-lighter" |
	"field-background" |
	"field-content" |
	"shade-01" |
	"shade-02" |
	"shade-03" |
	"shade-04" |
	"shade-05" |
	"shade-06" |
	"shade-dark-01" |
	"shade-dark-02" |
	"shade-dark-03" |
	"shade-light-01" |
	"shade-light-02" |
	"shade-light-03" |
	"content-shade-standard" |
	"content-shade-faded" |
	"content-link" |
	"content-link-visited" |
	"selection-primary"

export type ColourPalette = {
	[name in ColourPaletteColours]: string;
};

export function createTheme(): ThemeID {
	let guid = crypto.randomUUID();

	return `${guid}:THEME`;
}
