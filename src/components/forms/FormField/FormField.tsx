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
	let errorRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		submitEvent.subscribe((data: T) => {
			let result = validationMethod(selector(data));
			setError(result);

			if (result != null) {
				data.error = true;
				
				if (errorRef.current != null) {
					errorRef.current!.setAttribute("data-visible", "visible");
				}
			}
		});
	}, []);

	return (
		<div className="field-outer">
			<label className="form-field-label">{label}</label>
			<input data-size={size} className="field-input" {...register(name, registerOptions ?? {})} defaultValue={defaultValue}></input>
			{error != null ? 
				<div ref={errorRef} className="form-error-message" data-visible="visible">
					<img className="form-error-message-image" src={Error}/>
					<p>{error}</p>
					<button className="circle-button form-error-close-button" type="button" onClick={() => errorRef.current!.setAttribute("data-visible", "hidden")}>
						<img src={Cross}/>
					</button>
				</div>
			: <></>}
		</div>
	);
}
