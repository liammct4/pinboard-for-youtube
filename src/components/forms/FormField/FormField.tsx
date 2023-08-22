import React, { useState, useEffect, useRef } from "react";
import { Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { MultiEvent } from "../../../lib/events/Event"
import Error from "./../../../../assets/icons/error.svg"
import Cross from "./../../../../assets/symbols/cross.svg"
import { FormValidator, IErrorFieldValues } from "../validated-form";
import "./FormField.css"

interface IFormFieldProperties<T extends IErrorFieldValues> {
	register: UseFormRegister<T>;
	registerOptions?: RegisterOptions<T> | null;
	label: string;
	name: Path<T>;
	size: "small" | "medium" | "large" | "max" ;
	validationMethod?: FormValidator;
	submitEvent: MultiEvent<T>;
	selector: (data: T) => string;
	defaultValue?: string;
}

export function FormField<T extends IErrorFieldValues>({ register, label, name, registerOptions, size, validationMethod = () => null, submitEvent, selector, defaultValue = "" }: IFormFieldProperties<T>): React.ReactNode {
	let [error, setError] = useState<string | null>();
	let [errorVisible, setErrorVisible] = useState<boolean>();

	useEffect(() => {
		submitEvent.subscribe((data: T) => {
			let result = validationMethod(selector(data));
			
			if (result != null) {
				data.error = true;
				
				setError(result);
				setErrorVisible(true);
			}
		});
	}, []);

	return (
		<div className="field-outer">
			<div className="input-row">
				<label className="label">{label}</label>
				<input data-size={size} className="small-text-input field-input" {...register(name, registerOptions ?? {})} defaultValue={defaultValue}></input>
			</div>
			{errorVisible ? 
				<div className="error-message">
					<img className="warning-image" src={Error}/>
					<p className="error-text">{error}</p>
					<button className="circle-button close-button" type="button" onClick={() => setErrorVisible(false)}>
						<img src={Cross}/>
					</button>
				</div>
			: <></>}
		</div>
	);
}
