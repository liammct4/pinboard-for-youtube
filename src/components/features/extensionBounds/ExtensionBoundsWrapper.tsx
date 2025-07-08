import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IWrapperProperties } from "../wrapper";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

export function ExtensionBoundsWrapper({ children }: IWrapperProperties) {
	const location = useLocation();
	const [ expanded, setExpanded ] = useState<boolean>();
	const size = useSelector((state: RootState) => state.settings.settings.extensionSize);
	useEffect(() => {
		// If the current page needs to expand the extension to fit properly.
		let paths = [
			"/app/menu/options/data?showEditor=true" // TODO...
		]

		setExpanded(paths.includes(location.pathname + location.search));
	}, [location]);

	return (
		<div
			className="extension-bounds"
			data-expanded-window={expanded}
			data-size-setting={size}>
			{children}
		</div>
	);
}

export type ExtensionSize = "small" | "medium" | "large" | "very large" | "max";
