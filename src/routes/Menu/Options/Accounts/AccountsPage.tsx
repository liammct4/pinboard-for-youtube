import { AccountsInfo } from "./AccountsInfo/AccountsInfo";
import "./AccountsPage.css"
import { Login } from "./Login/Login";
import { Register } from "./Register/Register";
import { Navigate, Route, Routes } from "react-router-dom";


export function AccountsPage() {
	return (
		<>
			<Routes>
				<Route path="login" element={<Login/>}/>
				<Route path="register" element={<Register/>}/>
				<Route path="/" element={<AccountsInfo/>}/>
			</Routes>
		</>
	);
}
