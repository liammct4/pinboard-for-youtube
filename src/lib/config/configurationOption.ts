export type InputMethodType = "Text" | "Numeric" | "Colour" | "Dropdown" | "Switch";
export type ConfigurationOption<T> = {
	displayName: string;
	dataName: string;
	inputMethod: InputMethodType;
	value: T;
}
