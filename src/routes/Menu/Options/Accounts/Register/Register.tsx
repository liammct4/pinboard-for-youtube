import { FormField } from "../../../../../components/forms/FormField/FormField";
import { IErrorFieldValues, useValidatedForm } from "../../../../../components/forms/validated-form";
import { FormStyleContext } from "../../../../../components/input/formStyleContext";
import { InputMethodType } from "../../../../../lib/config/configurationOption";
import "./Register.css"

interface IRegisterAccountForm extends IErrorFieldValues {
	email: string;
	password: string;
}

export function Register(): React.ReactNode {
	const onRegisterSubmitted = () => {
		// TODO: Connect to API.
	}

	const { register, handleSubmit, handler, submit } = useValidatedForm<IRegisterAccountForm>(onRegisterSubmitted);

	return (
		<div className="register-account-page">
			<h2 className="account-heading">Create an account</h2>
			<hr className="bold-separator"/>
			<form className="register-account-form" id="register-account-form" onSubmit={handleSubmit(handler)}>
				<FormStyleContext.Provider value={{ labelSize: "medium" }}>
					<FormField<IRegisterAccountForm>
						label="Email address"
						name="email"
						register={register}
						selector={(data: IRegisterAccountForm) => data.email}
						inputType={InputMethodType.Text}
						submitEvent={submit.current}
						fieldSize="large"
						validationMethod={(value: string) => {
							if (!value.includes("@")) {
								return "That email address is not valid.";
							}

							return null;
						}}/>
					<FormField<IRegisterAccountForm>
						label="Password"
						name="password"
						register={register}
						selector={(data: IRegisterAccountForm) => data.password}
						inputType={InputMethodType.Text}
						submitEvent={submit.current}
						fieldSize="large"
						validationMethod={(value: string) => {
							if (value.length < 10) {
								return "Password must have a minimum of 10 characters.";
							}

							return null;
						}}/>
				</FormStyleContext.Provider>
			</form>
			<input
				className="button-base button-medium register-account-button"
				type="submit"
				form="register-account-form"
				value="Create Account"/>
		</div>
	);
}
