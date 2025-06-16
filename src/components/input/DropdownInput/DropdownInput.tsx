/// <reference types="vite-plugin-svgr/client" />

import { useContext } from "react";
import { IInputComponentProperties } from "../inputComponent";
import { FormStyleContext } from "../formStyleContext";
import * as Select from "@radix-ui/react-select"
import ArrowIcon from "./../../../../assets/symbols/arrows/arrowhead.svg?react"
import { IconContainer } from "../../images/svgAsset";
import { SelectItem } from "./dropdown";
import "./../../../styling/elements/select.css"
import "./../Input.css"
import { FieldErrorContainer } from "../../forms/Errors/FieldErrorContainer/FieldErrorContainer";

export interface IDropdownInputProperties<TField> extends IInputComponentProperties<TField> {
	options?: string[]
}

export function DropdownInput<TField extends string>({ label, name, fieldSize, startValue, options = [] }: IDropdownInputProperties<TField>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	
	return (
		<div className="field-row">
			<label className="label" data-size={labelSize}>{label}</label>
			<div className="form-dropdown-outer">
				<Select.Root
					name={name}
					defaultValue={startValue}> 
					<Select.Trigger className="select-button field-input" aria-label="Theme" data-size={fieldSize}>
						<Select.Value placeholder="Choose a theme..."/>
						{/* So the button is at a constant size and to fill in space... */}
						<span style={{ opacity: 0, flexGrow: 1 }}>.</span>
						<Select.Icon className="open-icon">
							<IconContainer
								className="icon-colour-field"
								asset={ArrowIcon}
								use-stroke
							/>
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
