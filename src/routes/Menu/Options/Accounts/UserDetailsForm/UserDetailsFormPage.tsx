import { useOutletContext } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import { IErrorFieldValues, useValidatedForm } from "../../../../../components/forms/validated-form";
import { UserDetailsFormPrimitive } from "./UserDetailsFormPrimitive";

export interface IUserDetailsForm extends IErrorFieldValues {
	email: string;
	password: string;
}

export type UserDetailsFormContext = {
	onSubmitted: SubmitHandler<IUserDetailsForm>;
	formName: string;
	submitText: string;
}

export function UserDetailsFormPage() {
	const { onSubmitted, formName, submitText } = useOutletContext<UserDetailsFormContext>();
	const { register, handleSubmit, handler, submit } = useValidatedForm<IUserDetailsForm>(onSubmitted);

	return (
		<>
			<form className={formName} id={formName} onSubmit={handleSubmit(handler)}>
				<UserDetailsFormPrimitive register={register} submit={submit.current} show-email/>
			</form>
			<input
				className="button-base button-medium register-account-button"
				type="submit"
				form={formName}
				value={submitText}/>
		</>
	);
}
