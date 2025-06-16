import "./SplitHeading.css"

export interface ISplitHeadingProperties {
	className?: string;
	text: string;
	type?: "Bold" | "Regular";
}

export function SplitHeading({ className = "", text, type = "Bold" }: ISplitHeadingProperties): React.ReactNode {
	return (
		<div className={`${type == "Bold" ? "outer-heading-box-bold" : "outer-heading-box-regular"} ${className.trim()}`}>
			<h2 className="heading-text">{text}</h2>
		</div>
	);
}
