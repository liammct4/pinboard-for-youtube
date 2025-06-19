/// <reference types="vite-plugin-svgr/client" />

import { Outlet, useNavigate } from "react-router-dom";
import PfyLogo from "./../../assets/logo/logo.svg?react";

export function HomePage(): React.ReactNode {
	const navigate = useNavigate();

	return (
		<div className="outer-body">
			<div className="header-area">
				<PfyLogo className="extension-logo"/>
				<h1 className="extension-title">Pinboard for YouTube</h1>
				<hr className="bold-separator"></hr>
			</div>
			<div className="inner-body-content">
				<Outlet/>
			</div>
			<div className="footer-area">
				<hr className="bold-separator"></hr>
				<div className="button-options">
					<button className="button-base button-small"
						onClick={() => navigate("menu/options")}
						title="Change settings.">Options</button>
					<button className="button-base button-small"
						onClick={() => navigate("menu/help")}
						title="Find guides and report bugs.">Help</button>
				</div>
				<h2 className="extension-version">Version 1.0.0</h2>
			</div>
		</div>
	);
}
