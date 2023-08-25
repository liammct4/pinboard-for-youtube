import React, { useState, useEffect, useRef } from "react";
import { Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { MultiEvent } from "../../../lib/events/Event"
import Error from "./../../../../assets/icons/error.svg"
import Cross from "./../../../../assets/symbols/cross.svg"
import { FormValidator, IErrorFieldValues } from "../validated-form";
import "./FormField.css"
import { InputMethodType } from "../../../lib/config/configurationOption";
import { getInputComponent } from "../../input/componentLocator";

interface IFormFieldProperties<TFormType extends IErrorFieldValues> {
	register: UseFormRegister<TFormType>;
	registerOptions?: RegisterOptions<TFormType> | null;
	label: string;
	name: Path<TFormType>;
	size: "small" | "medium" | "large" | "max";
	inputType?: InputMethodType;
	validationMethod?: FormValidator;
	submitEvent: MultiEvent<TFormType>;
	selector: (data: TFormType) => string;
	defaultValue?: string;
}

export function FormField<T extends IErrorFieldValues>({ register, label, name, registerOptions, size, validationMethod = () => null, submitEvent, selector, inputType = InputMethodType.Text, defaultValue = "" }: IFormFieldProperties<T>): React.ReactNode {
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
			else {
				setErrorVisible(false);
			}
		});
	}, []);

	const FieldInputElement = getInputComponent<T>(inputType);

	return (
		<div className="field-outer">
			<FieldInputElement
				label={label}
				name={name}
				fieldSize={size}
				register={register}
				registerOptions={registerOptions ?? {}}
				startValue={defaultValue}
			/>
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
