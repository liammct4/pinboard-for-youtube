import "./Header.css"
import PfyLogo from "./../../../../../assets/logo/logo.svg?react";

export function Header() {
	return (
		<div className="header-area">
			<PfyLogo className="extension-logo"/>
			<h1 className="extension-title">Pinboard for YouTube</h1>
			<hr className="bold-separator"></hr>
		</div>
	)
}
