export enum InputMethodType { Text, Numeric, Colour }
export type ConfigurationOption<T> = {
	displayName: string;
	dataName: string;
	inputMethod: InputMethodType;
	value: T;
}
