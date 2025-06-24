import React from "react";

export interface IBaseButtonProperties {
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	title?: string;
	autoFocus?: boolean;
	type?: "submit" | "reset" | "button" | undefined;
	disabled?: boolean;
	children?: string | JSX.Element[] | JSX.Element | React.ReactNode | React.ReactNode[];
}

export function BaseButton(props: IBaseButtonProperties) {
	return (
		<button
			{...props}
			className={`${props.className} button-base`}/>
	)
}

export interface IBaseInputButtonProperties {
	form?: string;
	value?: string;
	type?: React.HTMLInputTypeAttribute;
	className?: string;
	ref?: React.MutableRefObject<HTMLInputElement>;
}

export function BaseInputButton(props: IBaseInputButtonProperties) {
	return (
		<input
			{...props}
			className={`${props.className} button-base`}/>
	)
}
