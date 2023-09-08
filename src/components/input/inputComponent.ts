import { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { SizeOption } from "./formStyleContext";

/**
 * All the generic properties of an input element component
 * which can be used for different types of data. E.g. colours and time.
 */
export interface IInputComponentProperties<T extends FieldValues> {
	label: string;
	name: Path<T>;
	fieldSize: SizeOption;
	register: UseFormRegister<T>;
	registerOptions: RegisterOptions<T>;
	startValue: string;
}
