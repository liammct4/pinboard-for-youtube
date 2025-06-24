import { BaseButton, BaseInputButton, IBaseButtonProperties, IBaseInputButtonProperties } from "../BaseButton/BaseButton";
import "./SmallButton.css"

export interface ISmallButtonProperties extends IBaseButtonProperties {
	square?: boolean;
	circle?: boolean;
}

export function SmallButton(props: ISmallButtonProperties) {
	const actualProps = { ...props };

	delete actualProps.square;
	delete actualProps.circle;

	return <BaseButton
		{...props}
		className={`small-button ${props.className}`}
		data-shape={props.square ? "square" : props.circle ? "circle" : ""}/>
}

export function SmallInputButton(props: IBaseInputButtonProperties) {
	return <BaseInputButton {...props} className={`small-button ${props.className}`}/>
}
