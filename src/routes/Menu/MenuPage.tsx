/// <reference types="vite-plugin-svgr/client" />

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "./../../../assets/symbols/cross.svg?react"
import { IconContainer } from "../../components/images/svgAsset";
import { toTitleCase } from "../../lib/util/generic/stringUtil";
import "./MenuPage.css"
import { SmallButton } from "../../components/interactive/buttons/SmallButton/SmallButton";
import { SubtleButton } from "../../components/interactive/buttons/SubtleButton/SubtleButton";
import { useDialogPausedHotkeys } from "../../components/dialogs/useDialogPausedHotkeys";

export function MenuPage(): React.ReactNode {
	const navigate = useNavigate();
	const location = useLocation();
	
	const currentPath: string[] = decodeURI(location.pathname).split("/");
	// Remove everything before options page.
	currentPath.splice(0, 3);

	useDialogPausedHotkeys("ArrowLeft", () => {
		if (currentPath.length != 1) {
			navigate("/app/menu/" + encodeURI(currentPath.slice(0, currentPath.length - 1).join("/")));
		}
	});

	return (
		<>
			<div className="menu-outer">
				<div className="menu-controls scrollbar-small">
					<ul className="path-links">
						{currentPath.map(x =>
							<li className="path-item" key={x}>
								{
									x == currentPath[currentPath.length - 1] ?
										<span className="current-link">{toTitleCase(x)}</span>
									:
										<SubtleButton className="path-history" onClick={() => {
											let fullPath: string = encodeURI(currentPath
												.slice(0, currentPath.indexOf(x) + 1)
												.join("/")
											);

											navigate("/app/menu/" + fullPath)
										}}>
											<span>{toTitleCase(x)}</span>
										</SubtleButton>
								}
							</li>
						)}
					</ul>
					<SmallButton circle className="close-button" onClick={() => navigate("..")}>
						<IconContainer
							className="icon-colour-standard"
							asset={CloseIcon}
							use-stroke/>
					</SmallButton>
					<hr className="bold-separator"></hr>
				</div>
				<div className="page-content">
					<Outlet/>
				</div>
			</div>
		</>
	);
}
