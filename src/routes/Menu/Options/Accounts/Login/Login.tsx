import { Outlet } from "react-router-dom";
import "./Login.css"

export function Login(): React.ReactNode {
	return (
		<div className="account-login-page">
			<Outlet/>
		</div>
	);
}
