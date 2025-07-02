/// <reference types="vite-plugin-svgr/client" />

import { useContext } from "react";
import { IInputComponentProperties } from "../inputComponent";
import { FormStyleContext } from "../formStyleContext";
import ArrowIcon from "./../../../../assets/symbols/arrows/arrowhead.svg?react"
import { IconContainer } from "../../images/svgAsset";
import "./../../../styling/elements/select.css"
import "./../Input.css"
import "./DropdownInput.css"

export type SelectOption<T> = { id: T; label: string };

export interface IDropdownInputProperties<TField, TOptionID> extends IInputComponentProperties<TField> {
	options?: SelectOption<TOptionID>[]
}

export function DropdownInput<TField extends string, TOptionID extends string>({ label, name, fieldSize, startValue, options = [] }: IDropdownInputProperties<TField, TOptionID>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	
	return (
		<div className="field-row">
			<label className="label" data-size={labelSize}>{label}</label>
			<select
				className="dropdown-input small-text-input field-input"
				name={name}
				defaultValue={startValue}
				aria-label="Theme"
				data-size={fieldSize}>
					<button>
						{/* @ts-ignore Type definition doesn't exist but the element does. */}
						<selectedcontent/>
						<IconContainer className="icon-colour-field-content" asset={ArrowIcon} use-stroke/>
					</button>
					{options.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
			</select>
		</div>
	);
}
