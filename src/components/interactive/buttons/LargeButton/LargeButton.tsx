import { BaseButton, BaseInputButton, IBaseButtonProperties, IBaseInputButtonProperties } from "../BaseButton/BaseButton";
import "./LargeButton.css"

export function LargeButton(props: IBaseButtonProperties) {
	return <BaseButton
		{...props}
		className={`large-button ${props.className}`}/>
}

export function LargeInputButton(props: IBaseInputButtonProperties) {
	return <BaseInputButton
		{...props}
		className={`large-button ${props.className}`}/>
}
