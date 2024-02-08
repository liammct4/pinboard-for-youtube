import { AccountsInfo } from "./AccountsInfo/AccountsInfo";
import { Login } from "./Login/Login";
import { Register } from "./Register/Register";
import { Route, Routes } from "react-router-dom";
import { RegisterSuccess } from "./Register/RegisterSuccess/RegisterSuccess";
import { UserDetailsFormPage } from "./UserDetailsForm/UserDetailsFormPage";
import { AccountView } from "./AccountView/AccountView";
import "./AccountsPage.css"

export function AccountsPage() {
	return (
		<>
			<Routes>
				<Route path="login" element={<Login/>}>
					<Route path="/login/" element={<UserDetailsFormPage/>}/>
				</Route>
				<Route path="register" element={<Register/>}>
					<Route path="/register/" element={<UserDetailsFormPage/>}/>
					<Route path="/register/success" element={<RegisterSuccess/>}/>
				</Route>
				<Route path="account" element={<AccountView/>}/>
				<Route path="/" element={<AccountsInfo/>}/>
			</Routes>
		</>
	);
}
