import { IInputComponentProperties } from "../inputComponent";
import { useContext, useMemo, useState } from "react";
import { FormStyleContext } from "../formStyleContext";
import { convertRGBToHex } from "../../../lib/util/generic/colour/colourUtil";
import "./../Input.css"
import { FieldErrorContainer } from "../../forms/Errors/FieldErrorContainer/FieldErrorContainer";

const excludedKeys = ["Control", "Meta", "Alt", "Shift"]
const matchingKeysFilter = new Map<string, string>([
	[ "+", "=" ],
	[ "_", "-" ],
	[ "!", "1" ],
	[ "\"", "2" ],
	[ "£", "3" ],
	[ "$", "4" ],
	[ "%", "5" ],
	[ "^", "6" ],
	[ "&", "7" ],
	[ "*", "8" ],
	[ "(", "9" ],
	[ ")", "0" ],
	[ "¬", "`" ],
	[ "|", "\\" ],
	[ "<", "," ],
	[ ">", "." ],
	[ ":", ";" ],
	[ "@", "'" ],
	[ "{", "[" ],
	[ "}", "]" ],
	[ "~", "#" ],
	[ "?", "/" ],
]);

export function KeyInput<TField extends string>({ label, title, fieldSize, name, startValue }: IInputComponentProperties<TField>): React.ReactNode {
	const { labelSize } = useContext(FormStyleContext);
	const [ keyInput, setKeyInput ] = useState<string>(startValue);
	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		let pressed = [
			event.ctrlKey ? "Ctrl" : null,
			event.altKey ? "Alt" : null,
			event.shiftKey ? "Shift" : null,
			event.metaKey ? "Win" : null,
		].filter(x => x != null);

		if (event.key != undefined && !excludedKeys.includes(event.key)) {
			if (matchingKeysFilter.has(event.key)) {
				pressed.push(matchingKeysFilter.get(event.key.toUpperCase())!);
			}
			else {
				pressed.push(event.key.toUpperCase());
			}
		}

		setKeyInput(pressed.join(" + "));
	}
	
	return (
		<FieldErrorContainer name={name}>
			<div className="field-row" title={title}>
				<label className="label" data-size={labelSize}>{label}</label>
				<input
					className="field-input small-text-input"
					name={name}
					type="text"
					data-size={fieldSize}
					value={keyInput}
					onKeyDown={onKeyDown}/>
			</div>
		</FieldErrorContainer>
	);
}
