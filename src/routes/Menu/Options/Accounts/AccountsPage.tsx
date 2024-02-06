import { AccountsInfo } from "./AccountsInfo/AccountsInfo";
import { Login } from "./Login/Login";
import { Register } from "./Register/Register";
import { Route, Routes } from "react-router-dom";
import { UserDetailsForm } from "./UserDetailsForm/UserDetailsForm";
import { RegisterSuccess } from "./Register/RegisterSuccess/RegisterSuccess";
import "./AccountsPage.css"

export function AccountsPage() {
	return (
		<>
			<Routes>
				<Route path="login" element={<Login/>}>
					<Route path="/login/" element={<UserDetailsForm/>}/>
				</Route>
				<Route path="register" element={<Register/>}>
					<Route path="/register/" element={<UserDetailsForm/>}/>
					<Route path="/register/success" element={<RegisterSuccess/>}/>
				</Route>
				<Route path="/" element={<AccountsInfo/>}/>
			</Routes>
		</>
	);
}
