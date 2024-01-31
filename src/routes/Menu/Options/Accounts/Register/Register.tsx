import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { registerAccount } from "../../../../../lib/user/accounts";
import { IUserDetailsForm, UserDetailsForm } from "../UserDetailsForm/UserDetailsForm";
import "./Register.css"

export function Register(): React.ReactNode {
	const navigate = useNavigate();

	const onRegisterSubmitted = (value: IUserDetailsForm) => {
		let response = registerAccount(value.email, value.password);

		if (response == undefined) {
			return;
		}

		if (response.status == HttpStatusCode.OK) {
			navigate("success");
		}
	}

	return (
		<div className="register-account-page">
			<h2 className="account-heading">Create an account</h2>
			<hr className="bold-separator"/>
			<Outlet context={{ onRegisterSubmitted }}/>
		</div>
	);
}
