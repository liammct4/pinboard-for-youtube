import "./CircularLargeButton.css"

export interface ICircularLargeButtonProperties {
	children?: JSX.Element | JSX.Element[];
	onClick: () => void;
}

export function CircularLargeButton({ children, onClick }: ICircularLargeButtonProperties) {
	return (
		<button className="pfy-save-video-button button-base" onClick={onClick}>
			{children}
		</button>
	);
}
