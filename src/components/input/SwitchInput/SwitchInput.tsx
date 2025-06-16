import * as Switch from "@radix-ui/react-switch"
import { FormStyleContext, SizeOption } from "../formStyleContext";
import { IInputComponentProperties } from "../inputComponent";
import { useContext } from "react";
import "./SwitchInput.css"
import { FieldErrorContainer } from "../../forms/Errors/FieldErrorContainer/FieldErrorContainer";

export interface ISwitchInputPrimitiveProperties {
	label: string;
	switchFieldID?: string;
	reversed?: boolean;
	labelSize: SizeOption;
	value: boolean;
	onChange: (newValue: boolean) => void;
}

// There are two separate switches to allow the switch to be independently used outside of a form.

export function SwitchInputPrimitive({ label, labelSize, reversed = false, switchFieldID, value, onChange }: ISwitchInputPrimitiveProperties): React.ReactNode {
	return (
		<div className="switch-container" data-reversed={reversed} data-size={labelSize}>
			<Switch.Root
				className="field-input small-text-input switch-root"
				id={switchFieldID}
				value={`${value}`}
				onCheckedChange={() => onChange(!value)}>
				<Switch.Thumb className="switch-thumb"/>
			</Switch.Root>
			<label className="switch-text" htmlFor={switchFieldID}>{label}</label>
		</div>
	);
}


/*
 BUG: Radix UI doesn't load "defaultValue" correctly, so the result will be undefined IF it wasn't toggled.
 Means that you should use the "defaultValue" as the actual value whenever the submitted form value is undefined.
*/
export function SwitchInput<TField extends string>({ label, name, startValue }: IInputComponentProperties<TField>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);

	return (
		<FieldErrorContainer name={name}>
			<div className="field-row switch-container" data-size={labelSize}>
				<label className="label" data-size={labelSize}>{label}</label>
				{/* Doesn't work with RHF properly */}
				<Switch.Root
					className="field-input small-text-input switch-root"
					name={name}
					defaultChecked={startValue == "true"}
					defaultValue={startValue}>
					<Switch.Thumb className="switch-thumb"/>
				</Switch.Root>
			</div>
		</FieldErrorContainer>
	);
}
