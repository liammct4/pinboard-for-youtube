import { useOutletContext } from "react-router-dom";
import { UserDetailsForm, UserDetailsFormPrimitive } from "./UserDetailsFormPrimitive";
import { ValidatedForm } from "../../../../../components/forms/ValidatedForm";
import { MediumInputButton } from "../../../../../components/interactive/buttons/MediumButton/MediumButton";

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
			<MediumInputButton
				className="register-account-button"
				type="submit"
				form={formName}
				value={submitText}/>
		</>
	);
}
