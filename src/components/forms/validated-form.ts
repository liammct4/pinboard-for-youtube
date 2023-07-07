import { useRef } from "react"
import { MultiEvent } from "../../lib/events/Event";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export type FormValidator = (data: string) => string | null;

export interface IErrorFieldValues extends FieldValues {
	error: boolean
}

export function useValidatedForm<T extends IErrorFieldValues>(onSubmitHandler: SubmitHandler<T>) {
	let { register, handleSubmit, reset } = useForm<T>();
	let submit = useRef<MultiEvent<T>>(new MultiEvent<T>());

	let handler: SubmitHandler<T> = (data: T) => {
		data.error = false;
		submit.current.dispatch(data);
		if (!data.error) {
			onSubmitHandler(data);
		}
	}

	return { register, handleSubmit, handler, submit, reset };
}
