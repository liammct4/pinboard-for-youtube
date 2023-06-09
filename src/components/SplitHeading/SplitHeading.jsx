import "./SplitHeading.css"

export function SplitHeading({ text }) {
	return (
		<div className="outer-heading">
			<div className="split-heading-left-highlight"></div>
			<h2 className="split-heading-text">{text}</h2>
		</div>
	);
}

export default SplitHeading;
