import { useContext } from "react";
import { IInputComponentProperties } from "../inputComponent";
import { FormStyleContext } from "../formStyleContext";
import "./../Input.css"
import { FieldErrorContainer } from "../../forms/Errors/FieldErrorContainer/FieldErrorContainer";

export function NumericInput<TField extends string>({ label, fieldSize, name, startValue }: IInputComponentProperties<TField>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	
	return (
		<FieldErrorContainer name={name}>
			<div className="field-row">
				<label className="label" data-size={labelSize}>{label}</label>
				<input
					type="number"
					name={name}
					className="small-text-input field-input"
					data-size={fieldSize}
					defaultValue={startValue}
					data-converter="numeric"/>
			</div>
		</FieldErrorContainer>
	);
}
