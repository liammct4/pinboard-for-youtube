/// <reference types="vite-plugin-svgr/client" />

import { useState, useEffect } from "react";
import { Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { MultiEvent } from "../../../lib/events/Event"
import { SizeOption } from "../../input/formStyleContext";
import { FormValidator, IErrorFieldValues } from "../validated-form";
import { InputMethodType } from "../../../lib/config/configurationOption";
import { getInputComponent } from "../../input/componentLocator";
import WarningIcon from "./../../../../assets/icons/status/warning.svg?react"
import CrossIcon from "./../../../../assets/symbols/cross.svg?react"
import { IconContainer } from "../../images/svgAsset";
import "./FormField.css"

interface IFormFieldProperties<TFormType extends IErrorFieldValues> {
	register: UseFormRegister<TFormType>;
	registerOptions?: RegisterOptions<TFormType> | null;
	label: string;
	name: Path<TFormType>;
	fieldSize: SizeOption;
	inputType?: InputMethodType;
	validationMethod?: FormValidator;
	submitEvent: MultiEvent<TFormType>;
	selector: (data: TFormType) => string;
	defaultValue?: string;
	visible?: boolean;
}

export function FormField<T extends IErrorFieldValues>({
		register,
		label,
		name,
		registerOptions,
		fieldSize,
		validationMethod = () => null,
		submitEvent,
		selector,
		inputType = "Text",
		defaultValue = "",
		visible = true
	}: IFormFieldProperties<T>): React.ReactNode {
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
		<div className="field-outer" data-visible={visible}>
			<FieldInputElement
				label={label}
				name={name}
				fieldSize={fieldSize}
				register={register}
				registerOptions={registerOptions ?? {}}
				startValue={defaultValue}
			/>
			{errorVisible ? 
				<div className="error-message">
					<IconContainer
						className="icon-colour-standard warning-image"
						asset={WarningIcon}
						use-fill/>
					<p className="error-text">{error}</p>
					<button className="circle-button close-button" type="button" onClick={() => setErrorVisible(false)}>
						<IconContainer
							className="icon-colour-standard"
							asset={CrossIcon}
							use-stroke/>
					</button>
				</div>
			: <></>}
		</div>
	);
}
