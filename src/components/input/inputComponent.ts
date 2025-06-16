import { SizeOption } from "./formStyleContext";

/**
 * All the generic properties of an input element component
 * which can be used for different types of data. E.g. colours and time.
 */
export interface IInputComponentProperties<TField> {
	label: string;
	name: TField
	fieldSize: SizeOption;
	startValue: string;
}
