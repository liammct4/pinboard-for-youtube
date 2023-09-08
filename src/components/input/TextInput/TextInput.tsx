import { useContext } from "react";
import { FieldValues } from "react-hook-form";
import { IInputComponentProperties } from "../inputComponent";
import { FormStyleContext } from "../formStyleContext";
import "./../Input.css"

export function TextInput<T extends FieldValues>({ label, name, fieldSize, register, registerOptions, startValue }: IInputComponentProperties<T>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	
	return (
		<div className="field-row">
			<label className="label" data-size={labelSize}>{label}</label>
			<input
				className="small-text-input field-input"
				data-size={fieldSize}
				defaultValue={startValue}
				{...register(name, registerOptions ?? {})}/>
		</div>
	);
}
