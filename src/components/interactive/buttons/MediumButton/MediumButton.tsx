import { BaseButton, BaseInputButton, IBaseInputButtonProperties, ISizeButtonProperties } from "../BaseButton/BaseButton";
import "./MediumButton.css"

export function MediumButton(props: ISizeButtonProperties) {
	const actualProps = { ...props };

	delete actualProps.square;
	delete actualProps.circle;

	return <BaseButton
		{...actualProps}
		className={`medium-button ${props.className}`}
		data-shape={props.square ? "square" : props.circle ? "circle" : ""}/>
}


export function MediumInputButton(props: IBaseInputButtonProperties) {
	return <BaseInputButton
		{...props}
		className={`medium-button ${props.className}`}/>
}
