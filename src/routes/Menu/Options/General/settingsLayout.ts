import { SettingName } from "../../../../lib/config/settings";

export type SettingOption = "Heading" | "Field" | "Separator";
export interface ISettingElement {
	type: SettingOption
}

export interface ISettingHeading extends ISettingElement {
	type: "Heading",
	message: string;
	style: "Bold" | "Regular"
}

export interface ISettingField extends ISettingElement {
	type: "Field",
	fieldName: SettingName;
}

export interface ISettingSeparator extends ISettingElement {
	type: "Separator"
}

export type ElementCollection = ISettingHeading | ISettingField | ISettingSeparator

export const settingsLayout: ElementCollection[] = [
	{ type: "Heading", message: "Timeline Settings", style: "Bold" },
	{ type: "Field", fieldName: "timestampButtonsEnabled" },
	{ type: "Field", fieldName: "saveVideoTimestampButtonEnabled" },
	
	{ type: "Heading", message: "Autosaved Timestamp", style: "Regular" },
	{ type: "Field", fieldName: "useAutoSaveLatestTimestamp" },
	{ type: "Field", fieldName: "autoSaveLatestTimestampMessage" },

	{ type: "Separator" },

	{ type: "Heading", message: "Shortcuts & Bindings", style: "Bold" },
	{ type: "Field", fieldName: "pinCurrentTimestampShortcut" }
]
