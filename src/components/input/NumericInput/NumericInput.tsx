import { FieldValues } from "react-hook-form";
import { IInputComponentProperties } from "../inputComponent";
import "./../Input.css"

export function NumericInput<T extends FieldValues>({ label, fieldSize, name, register, registerOptions, startValue }: IInputComponentProperties<T>): React.ReactNode {
	return (
		<div className="field-row">
			<label className="label">{label}</label>
			<input
				type="number"
				className="small-text-input field-input"
				data-size={fieldSize}
				defaultValue={startValue}
				{...register(name, registerOptions ?? {})}/>
		</div>
	);
}
