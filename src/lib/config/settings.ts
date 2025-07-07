import { SelectOption } from "../../components/input/DropdownInput/DropdownInput";
import { InputMethodType } from "./configurationOption";

export type SettingValue = boolean | string | number | bigint;

export type SettingName = 
	"timestampButtonsEnabled" |
	"saveVideoTimestampButtonEnabled" |
	"pinCurrentTimestampShortcut" |
	"useAutoSaveLatestTimestamp" |
	"autoSaveLatestTimestampMessage" |
	"extensionSize"

export type Settings = {
	[name in SettingName]: SettingValue;
}

export type SettingDefinitions = {
	[name in SettingName]: SettingDefinition
}

type BaseSettingDefinition = {
	displayName: string;
	description: string;
	inputFormat: Exclude<InputMethodType, "Dropdown">;
	defaultValue: SettingValue;
}

export type DropdownSettingDefinition = {
	displayName: string;
	description: string;
	inputFormat: "Dropdown";
	options: SelectOption<string>[];
	defaultValue: SettingValue;
}

export type SettingDefinition = BaseSettingDefinition | DropdownSettingDefinition

export const settingDefinitions: SettingDefinitions = {
	timestampButtonsEnabled: {
		displayName: "Timeline timestamps",
		description: "Shows saved timestamps on a videos timeline on the YouTube page.",
		inputFormat: "Switch",
		defaultValue: true
	},
	saveVideoTimestampButtonEnabled: {
		displayName: "Save video button",
		description: "Shows a button on a video page which allows quick saving of the current video.",
		inputFormat: "Switch",
		defaultValue: true
	},
	pinCurrentTimestampShortcut: {
		displayName: "Pin timestamp shortcut",
		description: "Pins the current timestamp of a video when pressed.",
		inputFormat: "Key",
		defaultValue: "H"
	},
	useAutoSaveLatestTimestamp: {
		displayName: "Use auto timestamp",
		description: "Will automatically make a timestamp on the current video position, useful in the case of losing the current position where the timestamp had not been saved (E.g. A crash).",
		inputFormat: "Switch",	
		defaultValue: true
	},
	autoSaveLatestTimestampMessage: {
		displayName: "Timestamp message",
		description: "The message to be associated with the auto save feature. Will be updated as the video progresses.",
		inputFormat: "Text",
		defaultValue: "Autosaved timestamp!"
	},
	extensionSize: {
		displayName: "Extension Size",
		description: "The size/width of the extension when open.",
		defaultValue: "small",
		inputFormat: "Dropdown",
		options: [
			{ id: "small", label: "Small" },
			{ id: "medium", label: "Medium" },
			{ id: "large", label: "Large" },
			{ id: "very large", label: "Very Large" },
			{ id: "max", label: "Maximum" }
		]
	}
}

export const defaultSettings: Settings = {
	autoSaveLatestTimestampMessage: settingDefinitions.autoSaveLatestTimestampMessage.defaultValue,
	pinCurrentTimestampShortcut: settingDefinitions.pinCurrentTimestampShortcut.defaultValue,
	saveVideoTimestampButtonEnabled: settingDefinitions.saveVideoTimestampButtonEnabled.defaultValue,
	timestampButtonsEnabled: settingDefinitions.timestampButtonsEnabled.defaultValue,
	useAutoSaveLatestTimestamp: settingDefinitions.useAutoSaveLatestTimestamp.defaultValue,
	extensionSize: settingDefinitions.extensionSize.defaultValue
};
