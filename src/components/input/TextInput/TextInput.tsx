import { HTMLInputTypeAttribute, createContext, useContext } from "react";
import { FieldValues } from "react-hook-form";
import { IInputComponentProperties } from "../inputComponent";
import { FormStyleContext } from "../formStyleContext";
import "./../Input.css"

interface ITextInputContext {
	textInputType: HTMLInputTypeAttribute;
}

export function TextInput<T extends FieldValues>({ label, name, fieldSize, register, registerOptions, startValue }: IInputComponentProperties<T>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	const { textInputType } = useContext<ITextInputContext>(TextInputContext);
	
	return (
		<div className="field-row">
			<label className="label" data-size={labelSize}>{label}</label>
			<input
				className="small-text-input field-input"
				data-size={fieldSize}
				type={textInputType}
				defaultValue={startValue}
				{...register(name, registerOptions ?? {})}/>
		</div>
	);
}

export const TextInputContext = createContext<ITextInputContext>({
	textInputType: "text"
});
