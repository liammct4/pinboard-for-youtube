import { IInputComponentProperties } from "../inputComponent";
import { useContext, useMemo } from "react";
import { FormStyleContext } from "../formStyleContext";
import { convertRGBToHex } from "../../../lib/util/generic/colour/colourUtil";
import "./../Input.css"
import { FieldErrorContainer } from "../../forms/Errors/FieldErrorContainer/FieldErrorContainer";

export function ColourInput<TField extends string>({ label, fieldSize, name, startValue }: IInputComponentProperties<TField>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	const colour = useMemo(() => startValue.startsWith("rgb(") ? convertRGBToHex(startValue) : startValue, [startValue]);
	
	return (
		<FieldErrorContainer name={name}>
			<div className="field-row">
				<label className="label" data-size={labelSize}>{label}</label>
				<div className="field-input small-text-input" data-size={fieldSize}>
					<input
						className="field-input small-text-input"
						name={name}
						type="color"
						data-size={fieldSize}
						defaultValue={colour}/>
				</div>
			</div>
		</FieldErrorContainer>
	);
}
