import { FieldValues } from "react-hook-form";
import { IInputComponentProperties } from "../inputComponent";
import "./../Input.css"

export function TextInput<T extends FieldValues>({ label, name, fieldSize, register, registerOptions, startValue }: IInputComponentProperties<T>): React.ReactNode {
	return (
		<div className="field-row">
			<label className="label">{label}</label>
			<input
				className="small-text-input field-input"
				data-size={fieldSize}
				defaultValue={startValue}
				{...register(name, registerOptions ?? {})}/>
		</div>
	);
}
