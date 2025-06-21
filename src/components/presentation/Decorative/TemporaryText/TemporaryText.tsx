import { useEffect } from "react";
import "./TemporaryText.css";

export interface ITemporaryTextProperties {
	className?: string;
	textVisible: boolean;
	setTextVisible: (visible: boolean) => void;
	visibleTime: number;
	children?: string;
}

export function TemporaryText({ className, textVisible, setTextVisible, visibleTime, children }: ITemporaryTextProperties) {
	useEffect(() => {
		if (textVisible == true) {
			setTimeout(() => {
				setTextVisible(false);
			}, visibleTime);
		}
	}, [textVisible]);

	return (
		textVisible ? 
			<span className={`${className} temporary-text`}>{children}</span> :
			<></>
	);
}
