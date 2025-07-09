import React from "react";
import "./BaseButton.css"

export interface IBaseButtonProperties extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {

}

export function BaseButton(props: IBaseButtonProperties) {
	return (
		<button
			{...props}
			className={`${props.className} button-base`}/>
	)
}

export interface ISizeButtonProperties extends IBaseButtonProperties {
	square?: boolean;
	circle?: boolean;
}

export interface IBaseInputButtonProperties extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {

}

export function BaseInputButton(props: IBaseInputButtonProperties) {
	return (
		<input
			{...props}
			className={`${props.className} button-base`}/>
	)
}
