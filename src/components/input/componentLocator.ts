import { FieldValues } from "react-hook-form";
import { InputMethodType } from "../../lib/config/configurationOption";
import { ColourInput } from "./ColourInput/ColourInput";
import { NumericInput } from "./NumericInput/NumericInput";
import { TextInput } from "./TextInput/TextInput";
import { IInputComponentProperties } from "./inputComponent";
import { DropdownInput } from "./DropdownInput/DropdownInput";
import { SwitchInput } from "./SwitchInput/SwitchInput";

export function getInputComponent<T extends FieldValues>(inputType: InputMethodType): React.FC<IInputComponentProperties<T>> {
	switch (inputType) {
		case "Text":
			return TextInput;
		case "Numeric":
			return NumericInput;
		case "Colour":
			return ColourInput;
		case "Dropdown":
			return DropdownInput;
		case "Switch":
			return SwitchInput;
	}
}
