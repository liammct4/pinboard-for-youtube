import { useEffect, useRef } from "react";
import { IWrapperProperties } from "../wrapper";
import { ColourPaletteColours } from "../../../lib/config/theming/appTheme";
import { useTheme } from "../useTheme";

export interface IStyleContextWrapper extends IWrapperProperties {
	"update-theme"?: boolean;
	"use-transition"?: boolean;
}

export function StyleContextWrapper({ children, "update-theme": updateTheme, "use-transition": useTransition }: IStyleContextWrapper) {
	const styleContextRef = useRef<HTMLDivElement>(null!);
	const { currentTheme, currentThemeData } = useTheme();

	useEffect(() => {
		if (!updateTheme) {
			return;
		}

		Object.keys(currentThemeData.palette).forEach(key => {
			let value = currentThemeData.palette[key as ColourPaletteColours] as string;

			styleContextRef.current.style.setProperty(`--pfy-${key}`, value);
		});
	}, [JSON.stringify(currentTheme)]);

	return (
		<div className="pfy-style-context" ref={styleContextRef} data-transition={useTransition}>
			{children}
		</div>
	)
}
