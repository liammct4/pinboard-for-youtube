import { IKeyIDItem } from "../../../components/features/useAccountInfo";

export interface IAppTheme extends IKeyIDItem {
	name: string;
	palette: ColourPalette;
	modifiable: boolean;
}

export type ColourPalette = {
	"primary-common": string;
	"primary-faded": string;
	"primary-dark": string;
	"primary-ultradark": string;
	"empty-01-normal": string;
	"empty-01-raised": string;
	"empty-01-depth": string;
	"empty-01-shadow": string;
	"empty-02-normal": string;
	"empty-02-raised": string;
	"empty-02-depth": string;
	"empty-02-shadow": string;
	"text-strong": string;
	"text-normal": string;
	"text-light": string;
	"text-lighter": string;
	"shade-01": string;
	"shade-02": string;
	"shade-03": string;
	"shade-04": string;
	"shade-05": string;
	"shade-06": string;
	"shade-dark-01": string;
	"shade-dark-02": string;
	"shade-dark-03": string;
	"shade-light-01": string;
	"shade-light-02": string;
	"shade-light-03": string;
	"content-shade-standard": string;
	"content-shade-faded": string;
	"content-link": string;
	"content-link-visited": string;
	"selection-primary": string;
};
