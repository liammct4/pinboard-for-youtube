export type InputMethodType = "Text" | "Numeric" | "Colour" | "Dropdown" | "Switch" | "Key";
export type ConfigurationOption<T> = {
	displayName: string;
	dataName: string;
	inputMethod: InputMethodType;
	value: T;
}
