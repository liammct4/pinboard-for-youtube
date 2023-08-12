import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import Close from "./../../../assets/symbols/cross.svg"
import "./MenuPage.css"

export function MenuPage(): React.ReactNode {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");

	return (
		<div className="menu-outer">
			<h1 className="title-heading">{title}</h1>
			<button className="close-menu-button circle-button" onClick={() => navigate("..")}>
				<img src={Close}/>
			</button>
			<hr></hr>
			<div className="menu-page-content">
				<Outlet context={setTitle}/>
			</div>
		</div>
	);
}

export default MenuPage;
