import { Outlet, useNavigate } from "react-router-dom";
import PfyLogo from "./../../assets/logo/logo.svg"
import "./HomePage.css"

export function HomePage(): React.ReactNode {
	const navigate = useNavigate();

	return (
		<div className="pfy-style-context outer-body">
			<div className="header-area">
				<img className="extension-logo" src={PfyLogo}/>
				<h1 className="extension-title">Pinboard for YouTube</h1>
				<hr className="bold-separator"></hr>
			</div>
			<div className="inner-body-content">
				<Outlet/>
			</div>
			<div className="footer-area">
				<hr className="bold-separator"></hr>
				<div className="button-options">
					<button className="button-small"
						onClick={() => navigate("menu/options")}>Options</button>
					<button className="button-small"
						onClick={() => navigate("menu/help")}>Help</button>
				</div>
				<h2 className="extension-version">Version 1.0.0</h2>
			</div>
		</div>
	);
}

export default HomePage;
