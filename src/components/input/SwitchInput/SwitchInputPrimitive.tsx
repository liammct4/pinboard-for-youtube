import * as Switch from "@radix-ui/react-switch"
import { SizeOption } from "../formStyleContext";
import "./SwitchInputPrimitive.css"

export interface ISwitchInputPrimitiveProperties {
	label: string;
	switchFieldID?: string;
	reversed?: boolean;
	labelSize: SizeOption;
	value: boolean;
	onChange: (newValue: boolean) => void;
}

export function SwitchInputPrimtive({ label, labelSize, reversed = false, switchFieldID, value, onChange }: ISwitchInputPrimitiveProperties): React.ReactNode {
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
