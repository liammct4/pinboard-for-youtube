import { BaseButton } from "../../../../components/interactive/buttons/BaseButton/BaseButton";
import "./CircularLargeButton.css"

export interface ICircularLargeButtonProperties {
	children?: JSX.Element | JSX.Element[];
	onClick: () => void;
}

export function CircularLargeButton({ children, onClick }: ICircularLargeButtonProperties) {
	return (
		<BaseButton className="pfy-save-video-button" onClick={onClick}>
			{children}
		</BaseButton>
	);
}
