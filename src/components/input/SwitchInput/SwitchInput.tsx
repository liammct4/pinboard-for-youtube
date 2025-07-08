import * as Switch from "@radix-ui/react-switch"
import { FormStyleContext, SizeOption } from "../formStyleContext";
import { IInputComponentProperties } from "../inputComponent";
import { useContext, useState } from "react";
import "./SwitchInput.css"
import { FieldErrorContainer } from "../../forms/Errors/FieldErrorContainer/FieldErrorContainer";

export interface ISwitchInputPrimitiveProperties {
	className?: string;
	label: string;
	switchFieldID?: string;
	reversed?: boolean;
	labelSize: SizeOption | "auto";
	value: boolean;
	onChange: (newValue: boolean) => void;
}

// There are two separate switches to allow the switch to be independently used outside of a form.

export function SwitchInputPrimitive({ className, label, labelSize, reversed = false, switchFieldID, value, onChange }: ISwitchInputPrimitiveProperties): React.ReactNode {
	return (
		<div className={`${className} switch-container`} data-reversed={reversed} data-size={labelSize}>
			<Switch.Root
				className="field-input small-text-input switch-root"
				id={switchFieldID}
				value={`${value}`}
				checked={value}
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
export function SwitchInput<TField extends string>({ label, title, name, startValue }: IInputComponentProperties<TField>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	const [ checked, setChecked ] = useState<boolean>(startValue == "true");

	return (
		<FieldErrorContainer name={name}>
			<div className="field-row switch-container" title={title} data-size={labelSize}>
				<label className="label" data-size={labelSize}>{label}</label>
				{/* Radix switch behaves extremely oddly and doesn't work properly with forms. */}
				<Switch.Root
					className="field-input small-text-input switch-root"
					onCheckedChange={(changed) => setChecked(changed)}
					defaultChecked={startValue == "true"}>
					<Switch.Thumb className="switch-thumb"/>
				</Switch.Root>
				{/* Temporary */}
				<input name={name} style={{ width: 0, height: 0, visibility: "collapse" }} value={`${checked}`} data-converter="boolean"/>
			</div>
		</FieldErrorContainer>
	);
}
