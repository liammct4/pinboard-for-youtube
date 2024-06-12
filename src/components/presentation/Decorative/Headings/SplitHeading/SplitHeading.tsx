import "./SplitHeading.css"

export interface ISplitHeadingProperties {
	className?: string;
	text: string;
	type?: "bold" | "regular";
}

export function SplitHeading({ className = "", text, type = "bold" }: ISplitHeadingProperties): React.ReactNode {
	return (
		<div className={`${type == "bold" ? "outer-heading-box-bold" : "outer-heading-box-regular"} ${className.trim()}`}>
			<h2 className="heading-text">{text}</h2>
		</div>
	);
}
