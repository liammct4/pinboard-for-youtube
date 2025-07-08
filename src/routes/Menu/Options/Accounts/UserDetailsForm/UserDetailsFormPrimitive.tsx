import { TextInput } from "../../../../../components/input/TextInput/TextInput";
import { FormStyleContext } from "../../../../../components/input/formStyleContext";
import { validatePasswordInputField } from "../../../../../lib/user/password";
import { FormField } from "../../../../../components/forms/ValidatedForm";

export interface IUserDetailsFormPrimitiveProperties {
	showEmail?: boolean;
	showPassword?: boolean;
}

export type UserDetailsFormField = "email" | "password";
export type UserDetailsForm = {
	email: string;
	password: string;
}

export function UserDetailsFormPrimitive({ showEmail = true, showPassword = true }: IUserDetailsFormPrimitiveProperties): React.ReactNode {
	showEmail ?? showPassword;
	
	return (
		<FormStyleContext.Provider value={{ labelSize: "medium" }}>
			<TextInput<UserDetailsFormField>
				label="Email address"
				title="Enter your email address."
				name="email"
				fieldSize="large"
				startValue=""/>
			<TextInput<UserDetailsFormField>
				label="Password"
				title="Enter your password."
				name="password"
				fieldSize="large"
				startValue=""
				textInputType="password"/>
		</FormStyleContext.Provider>
	)
}

export const userDetailsFieldData: FormField<UserDetailsFormField>[] = [
	{
		name: "email",
		validator: (value: string) => {
			if (!value.includes("@")) {
				return {
					error: true,
					details: {
						name: "email",
						message: "That email address is not valid."
					}
				}
			}
	
			return { error: false };
		}
	},
	{
		name: "password",
		validator: (value: string) => {
			let result = validatePasswordInputField(value);

			if (result == null) {
				return { error: false };
			}

			return {
				error: true,
				details: {
					name: "password",
					message: result
				}
			}
		}
	}
]
