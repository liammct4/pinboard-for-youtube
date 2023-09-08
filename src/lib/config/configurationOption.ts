export enum InputMethodType { Text, Numeric, Colour, Dropdown }
export type ConfigurationOption<T> = {
	displayName: string;
	dataName: string;
	inputMethod: InputMethodType;
	value: T;
}
