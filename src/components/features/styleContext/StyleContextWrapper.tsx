import { useEffect, useRef } from "react";
import { IWrapperProperties } from "../wrapper";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { ColourPaletteColours } from "../../../lib/config/theming/appTheme";

export interface IStyleContextWrapper extends IWrapperProperties {
	"update-theme"?: boolean;
	"use-transition"?: boolean;
}

export function StyleContextWrapper({ children, "update-theme": updateTheme, "use-transition": useTransition }: IStyleContextWrapper) {
	const styleContextRef = useRef<HTMLDivElement>(null!);
	const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

	useEffect(() => {
		if (!updateTheme) {
			return;
		}

		Object.keys(currentTheme.palette).forEach(key => {
			let value = currentTheme.palette[key as ColourPaletteColours] as string;

			styleContextRef.current.style.setProperty(`--pfy-${key}`, value);
		});
	}, [JSON.stringify(currentTheme)]);

	return (
		<div className="pfy-style-context" ref={styleContextRef} data-transition={useTransition}>
			{children}
		</div>
	)
}
