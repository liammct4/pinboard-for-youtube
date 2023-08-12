import { Outlet, useNavigate } from "react-router-dom";
import "./HomePage.css"

export function HomePage(): React.ReactNode {
	const navigate = useNavigate();

	return (
		<>
			<div className="pfy-style-context outer-body">
				<div className="outer-section-area top-area">
					<div id="top-section-inner-wrap">
						<img className="logo-standard" src="../assets/logo/logo.png"/>
						<h1 className="title-heading">Pinboard for YouTube</h1>
					</div>
					<hr></hr>
				</div>
				<div className="inner-body">
					<Outlet/>
				</div>
				<div className="outer-section-area bottom-area">
					<hr></hr>
					<div id="bottom-section-inner-wrap">
						<button className="button-small" style={{gridColumn: 1, gridRow: 1}}
							onClick={() => navigate("menu/options")}>Options</button>
						<button className="button-small" style={{gridColumn: 1, gridRow: 2}}
							onClick={() => navigate("menu/help")}>Help</button>
						<h2 className="outer-area-subtle-text">Version 1.0.0</h2>
					</div>
				</div>
			</div>
		</>
	);
}

export default HomePage;
