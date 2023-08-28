import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Close from "./../../../assets/symbols/cross.svg"
import { toTitleCase } from "../../lib/util/generic/stringUtil";
import "./MenuPage.css"

export function MenuPage(): React.ReactNode {
	const navigate = useNavigate();
	const location = useLocation();
	
	const currentPath: Array<string> = location.pathname.split("/");
	// Remove everything before options page.
	currentPath.splice(0, 2);

	return (
		<div className="menu-outer">
			<ul className="path-links">
				{currentPath.map(x =>
					<li className="path-item" key={x}>
						{
							x == currentPath[currentPath.length - 1] ?
								<span className="current-link">{toTitleCase(x)}</span>
							:
								<button className="button-subtle path-history" onClick={() => {
									let fullPath: string = currentPath
										.slice(0, currentPath.indexOf(x) + 1)
										.join("/")
									navigate(fullPath)
								}}>
									<span>{toTitleCase(x)}</span>
								</button>
						}
					</li>
				)}
			</ul>
			<button className="close-button circle-button" onClick={() => navigate("..")}>
				<img src={Close}/>
			</button>
			<hr className="bold-separator"></hr>
			<div className="page-content">
				<Outlet/>
			</div>
		</div>
	);
}

export default MenuPage;
