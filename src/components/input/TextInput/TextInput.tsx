import { HTMLInputTypeAttribute, createContext, useContext } from "react";
import { IInputComponentProperties } from "../inputComponent";
import { FormStyleContext } from "../formStyleContext";
import "./../Input.css"
import { FieldErrorContainer } from "../../forms/Errors/FieldErrorContainer/FieldErrorContainer";

export interface ITextInputProperties<TField extends string> extends IInputComponentProperties<TField> {
	textInputType?: HTMLInputTypeAttribute;
}

export function TextInput<TField extends string>({ label, name, fieldSize, title, startValue, textInputType = "text" }: ITextInputProperties<TField>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	
	return (
		<FieldErrorContainer name={name}>
			<div className="field-row" title={title}>
				<label className="label" data-size={labelSize}>{label}</label>
				<input
					className="small-text-input field-input"
					name={name}
					data-size={fieldSize}
					type={textInputType}
					defaultValue={startValue}/>
			</div>
		</FieldErrorContainer>
	);
}
