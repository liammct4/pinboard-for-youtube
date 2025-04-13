import { useEffect, useRef } from "react";
import { IWrapperProperties } from "../wrapper";
import { useLocalStorage } from "../storage/useLocalStorage";

export function StyleContextWrapper({ children }: IWrapperProperties) {
	const styleContextRef = useRef<HTMLDivElement>(null!);
	const { storage } = useLocalStorage();

	useEffect(() => {
		let theme = storage.user_data.config.theme;

		Object.keys(theme.palette).forEach(key => {
			// @ts-ignore
			let value = theme.palette[key] as string;

			document.documentElement.style.setProperty(`--pfy-${key}`, value);
		});
	}, [JSON.stringify(storage.user_data.config.theme)]);

	return (
		<div className="pfy-style-context" ref={styleContextRef}>
			{children}
		</div>
	)
}
