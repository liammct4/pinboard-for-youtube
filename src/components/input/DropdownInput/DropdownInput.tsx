import { useContext } from "react";
import { FieldValues } from "react-hook-form";
import { IInputComponentProperties } from "../inputComponent";
import { DropdownOptionsContext } from "./context";
import { FormStyleContext } from "../formStyleContext";
import * as Select from "@radix-ui/react-select"
import ArrowIcon from "./../../../../assets/symbols/arrow.svg"
import "./../../../styling/elements/select.css"
import "./../Input.css"

function SelectItem({ value, children }: { value: string, children: React.ReactNode }): React.ReactNode {
	return (
		<Select.Item className="select-item" value={value}>
			<Select.ItemText>{children}</Select.ItemText>
		</Select.Item>
	);
}

export function DropdownInput<T extends FieldValues>({ label, name, fieldSize, register, registerOptions, startValue }: IInputComponentProperties<T>): React.ReactNode {
	const { onChange } = register(name, registerOptions ?? { });
	const { options } = useContext(DropdownOptionsContext);
	const { labelSize } = useContext(FormStyleContext);
	
	return (
		<div className="field-row">
			<label className="label" data-size={labelSize}>{label}</label>
			<div className="form-dropdown-outer">
				<Select.Root
					defaultValue={startValue}
					onValueChange={(value) => onChange({ target: { name, value } })}> 
					<Select.Trigger className="select-button field-input" aria-label="Theme" data-size={fieldSize}>
						<Select.Value placeholder="Choose a theme..."/>
						{/* So the button is at a constant size and to fill in space... */}
						<span style={{ opacity: 0, flexGrow: 1 }}>.</span>
						<Select.Icon className="open-icon">
							<img className="arrow" src={ArrowIcon}/>
						</Select.Icon>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content className="select-dropdown-content">
							<Select.Viewport className="select-viewport">
								<Select.Group className="select-group">
									{options.map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
								</Select.Group>
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>
		</div>
	);
}
