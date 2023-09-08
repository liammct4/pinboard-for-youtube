import { FieldValues } from "react-hook-form";
import { IInputComponentProperties } from "../inputComponent";
import { useContext, useMemo } from "react";
import { FormStyleContext } from "../formStyleContext";
import { convertRGBToHex } from "../../../lib/util/generic/colour/colourUtil";
import "./../Input.css"

export function ColourInput<T extends FieldValues>({ label, fieldSize, name, register, registerOptions, startValue }: IInputComponentProperties<T>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	const colour = useMemo(() => startValue.startsWith("rgb(") ? convertRGBToHex(startValue) : startValue, [startValue]);
	
	return (
		<div className="field-row">
			<label className="label" data-size={labelSize}>{label}</label>
			<div className="field-input small-text-input" data-size={fieldSize}>
				<input
					className="field-input small-text-input"
					type="color"
					data-size={fieldSize}
					defaultValue={colour}
					{...register(name, registerOptions ?? {})}/>
			</div>
		</div>
	);
}
