import { FieldValues } from "react-hook-form";
import { InputMethodType } from "../../lib/config/configurationOption";
import { ColourInput } from "./ColourInput/ColourInput";
import { NumericInput } from "./NumericInput/NumericInput";
import { TextInput } from "./TextInput/TextInput";
import { IInputComponentProperties } from "./inputComponent";
import { DropdownInput } from "./DropdownInput/DropdownInput";

export function getInputComponent<T extends FieldValues>(inputType: InputMethodType): React.FC<IInputComponentProperties<T>> {
	switch (inputType) {
		case InputMethodType.Text:
			return TextInput;
		case InputMethodType.Numeric:
			return NumericInput;
		case InputMethodType.Colour:
			return ColourInput;
		case InputMethodType.Dropdown:
			return DropdownInput;
	}
}
