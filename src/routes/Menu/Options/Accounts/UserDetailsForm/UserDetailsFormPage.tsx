import { useOutletContext } from "react-router-dom";
import { UserDetailsForm, UserDetailsFormPrimitive } from "./UserDetailsFormPrimitive";
import { ValidatedForm } from "../../../../../components/forms/ValidatedForm";

export type UserDetailsFormContext = {
	onSubmitted: (data: UserDetailsForm) => void;
	formName: string;
	submitText: string;
}

export function UserDetailsFormPage() {
	const { onSubmitted, formName, submitText } = useOutletContext<UserDetailsFormContext>();

	return (
		<>
			<ValidatedForm className={formName} name={formName} onSuccess={onSubmitted}>
				<UserDetailsFormPrimitive show-email/>
			</ValidatedForm>
			<input
				className="button-base button-medium register-account-button"
				type="submit"
				form={formName}
				value={submitText}/>
		</>
	);
}
