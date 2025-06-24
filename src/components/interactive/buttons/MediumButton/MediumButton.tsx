import { BaseButton, BaseInputButton, IBaseButtonProperties, IBaseInputButtonProperties } from "../BaseButton/BaseButton";
import "./MediumButton.css"

export function MediumButton(props: IBaseButtonProperties) {
	return <BaseButton
		{...props}
		className={`medium-button ${props.className}`}/>
}

export function MediumInputButton(props: IBaseInputButtonProperties) {
	return <BaseInputButton
		{...props}
		className={`medium-button ${props.className}`}/>
}
