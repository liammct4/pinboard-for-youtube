/// <reference types="vite-plugin-svgr/client" />

import { Outlet, useNavigate } from "react-router-dom";
import { ButtonPanel } from "../components/interactive/ButtonPanel/ButtonPanel";
import { SmallButton } from "../components/interactive/buttons/SmallButton/SmallButton";
import { Header } from "../components/presentation/extension/Header/Header";

export function HomePage(): React.ReactNode {
	const navigate = useNavigate();

	return (
		<div className="outer-body">
			<Header/>
			<div className="inner-body-content">
				<Outlet/>
			</div>
			<div className="footer-area">
				<hr className="bold-separator"></hr>
				<ButtonPanel className="button-options" direction="Vertical">
					<SmallButton
						onClick={() => navigate("menu/options")}
						title="Change settings.">
							Options
					</SmallButton>
					<SmallButton
						onClick={() => navigate("menu/help")}
						title="Find guides and report bugs.">
							Help
					</SmallButton>
				</ButtonPanel>
				<h2 className="extension-version">Version 1.0.0</h2>
			</div>
		</div>
	);
}
