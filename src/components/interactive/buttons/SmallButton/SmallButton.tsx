import { BaseButton, BaseInputButton, IBaseInputButtonProperties, ISizeButtonProperties } from "../BaseButton/BaseButton";
import "./SmallButton.css"

export function SmallButton(props: ISizeButtonProperties) {
	const actualProps = { ...props };

	delete actualProps.square;
	delete actualProps.circle;

	return <BaseButton
		{...actualProps}
		className={`small-button ${props.className}`}
		data-shape={props.square ? "square" : props.circle ? "circle" : ""}/>
}

export function SmallInputButton(props: IBaseInputButtonProperties) {
	return <BaseInputButton {...props} className={`small-button ${props.className}`}/>
}
