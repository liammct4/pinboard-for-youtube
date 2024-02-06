import { SubmitHandler } from "react-hook-form";
import { FormField } from "../../../../../components/forms/FormField/FormField";
import { IErrorFieldValues, useValidatedForm } from "../../../../../components/forms/validated-form";
import { FormStyleContext } from "../../../../../components/input/formStyleContext";
import { InputMethodType } from "../../../../../lib/config/configurationOption";
import { useOutletContext } from "react-router-dom";
import { TextInputContext } from "../../../../../components/input/TextInput/TextInput";

export interface IUserDetailsForm extends IErrorFieldValues {
	email: string;
	password: string;
}

export type UserDetailsFormContext = {
	onSubmitted: SubmitHandler<IUserDetailsForm>;
	formName: string;
	submitText: string;
}

export function UserDetailsForm() {
	const { onSubmitted, formName, submitText } = useOutletContext<UserDetailsFormContext>();
	const { register, handleSubmit, handler, submit } = useValidatedForm<IUserDetailsForm>(onSubmitted);

	return (
		<>
			<form className={formName} id={formName} onSubmit={handleSubmit(handler)}>
				<FormStyleContext.Provider value={{ labelSize: "medium" }}>
					<FormField<IUserDetailsForm>
						label="Email address"
						name="email"
						register={register}
						selector={(data: IUserDetailsForm) => data.email}
						inputType={InputMethodType.Text}
						submitEvent={submit.current}
						fieldSize="large"
						validationMethod={(value: string) => {
							if (!value.includes("@")) {
								return "That email address is not valid.";
							}

							return null;
						}}/>
					<TextInputContext.Provider value={{ textInputType: "password" }}>
						<FormField<IUserDetailsForm>
							label="Password"
							name="password"
							register={register}
							selector={(data: IUserDetailsForm) => data.password}
							inputType={InputMethodType.Text}
							submitEvent={submit.current}
							fieldSize="large"
							validationMethod={(value: string) => {
								if (value.length < 10) {
									return "Password must have a minimum of 10 characters.";
								}

								return null;
							}}/>
					</TextInputContext.Provider>
				</FormStyleContext.Provider>
			</form>
			<input
				className="button-base button-medium register-account-button"
				type="submit"
				form={formName}
				value={submitText}/>
		</>
	);
}
