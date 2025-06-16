import { createContext, useRef, useState } from "react";

export type FormFieldError<TField> = {
	name: TField;
	message: string;
}

type ValidatorError<TField> = { error: true, details: FormFieldError<TField> };
type ValidatorNoError = { error: false };

export type ValidatorResult<TField> = ValidatorError<TField> | ValidatorNoError
export type Validator<TField> = (data: string) => ValidatorResult<TField>;

export type FormField<TField> = {
	name: TField;
	validator: Validator<TField>;
}

export interface IValidatedFormProperties<TForm, TField> {
	className?: string;
	name: string;
	fieldData?: FormField<TField>[];
	onSuccess?: (data: TForm) => void;
	onError?: (data: TForm, errorList: FormFieldError<TField>[]) => void;
	children?: JSX.Element | JSX.Element[] | React.ReactNode | React.ReactNode[];
}

export function ValidatedForm<TForm, TField extends string>({ className, name, fieldData = [], onSuccess, onError, children }: IValidatedFormProperties<TForm, TField>) {
	const [ errors, setErrors ] = useState<FormFieldError<TField>[]>([]);
	const [ submitCounter, setSubmitCounter ] = useState<number>(0);
	
	return (
		<form
			className={className}
			id={name}
			name={name}
			onSubmit={(e) => {
				e.preventDefault();

				let rawData = new FormData(e.currentTarget);
				let data: {
					[field: string]: any
				} = { };

				for (let key of rawData.keys()) {
					data[key] = rawData.get(key);
				}

				let errors = fieldData
					.map(f => f.validator(rawData.get(f.name) as string))
					.filter(e => e.error)
					.map(e => e.details);

				if (errors.length > 0) {
					onError?.(data as TForm, errors);
				}
				else {
					onSuccess?.(data as TForm);
				}

				setErrors(errors);
				setSubmitCounter(submitCounter + 1);
			}}>
			<ValidatedFormErrorContext.Provider
				value={{
					submitCounter: submitCounter,
					errorList: errors
				}}>
				{children}
			</ValidatedFormErrorContext.Provider>
		</form>
	)
}

export interface IValidatedFormErrorContext {
	submitCounter: number;
	errorList: FormFieldError<string>[];
}

export const ValidatedFormErrorContext = createContext<IValidatedFormErrorContext>({
	submitCounter: 0,
	errorList: []
});
