import "./SplitHeading.css"

export interface ISplitHeadingProperties {
	className?: string;
	text: string;
}

export function SplitHeading({ className = "", text }: ISplitHeadingProperties): React.ReactNode {
	return (
		<div className={`outer-heading-box ${className.trim()}`}>
			<h2 className="heading-text">{text}</h2>
		</div>
	);
}
