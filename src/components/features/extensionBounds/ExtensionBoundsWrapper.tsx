import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IWrapperProperties } from "../wrapper";

export function ExtensionBoundsWrapper({ children }: IWrapperProperties) {
	const location = useLocation();
	const [expanded, setExpanded] = useState<boolean>();
	useEffect(() => {
		// If the current page needs to expand the extension to fit properly.
		let paths = [
			"/app/menu/options/accounts/conflicts" // TODO...
		]

		setExpanded(paths.includes(location.pathname));
	}, [location]);

	return (
		<div className="extension-bounds" data-expanded-window={expanded}>
			{children}
		</div>
	);
}
