import { UseFormRegister } from "react-hook-form";
import { FormField } from "../../../../../components/forms/FormField/FormField";
import { TextInputContext } from "../../../../../components/input/TextInput/TextInput";
import { FormStyleContext } from "../../../../../components/input/formStyleContext";
import { InputMethodType } from "../../../../../lib/config/configurationOption";
import { IUserDetailsForm } from "./UserDetailsFormPage";
import { MultiEvent } from "../../../../../lib/events/Event";
import { validatePasswordInputField } from "../../../../../lib/user/details/password";

export interface IUserDetailsFormPrimitiveProperties {
	register: UseFormRegister<IUserDetailsForm>
	submit: MultiEvent<IUserDetailsForm>,
	showEmail?: boolean;
	showPassword?: boolean;
}

export function UserDetailsFormPrimitive({ register, submit, showEmail = true, showPassword = true }: IUserDetailsFormPrimitiveProperties): React.ReactNode {
	const emailValidationActive = (value: string) => {
		if (!value.includes("@")) {
			return "That email address is not valid.";
		}

		return null;
	}

	return (
		<FormStyleContext.Provider value={{ labelSize: "medium" }}>
			<FormField<IUserDetailsForm>
				label="Email address"
				name="email"
				register={register}
				selector={(data: IUserDetailsForm) => data.email}
				inputType="Text"
				submitEvent={submit}
				fieldSize="large"
				// The email field does not need to be validated if not shown.
				validationMethod={showEmail ? emailValidationActive : () => null}
				defaultValue=""
				visible={showEmail}/>
			<TextInputContext.Provider value={{ textInputType: "password" }}>
				<FormField<IUserDetailsForm>
					label="Password"
					name="password"
					register={register}
					selector={(data: IUserDetailsForm) => data.password}
					inputType="Text"
					submitEvent={submit}
					fieldSize="large"
					validationMethod={showPassword ? validatePasswordInputField : () => null}
					visible={showPassword}/>
			</TextInputContext.Provider>
		</FormStyleContext.Provider>
	)
}
