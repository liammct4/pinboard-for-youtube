import { useState } from "react"
import "./SubtleExpander.css"
import { v4 as uuidv4 } from 'uuid';

export function SubtleExpander({ "open-message": open, "close-message": close, children }) {
	const [expanded, setExpanded] = useState(false);

	let collapseID = "se-" + uuidv4();
	let styling = "subtle-expander-symbol " + (expanded ? "rotate-close" : "rotate-open");

	return (
		<div className="subtle-expander-inner">
			<button onClick={(x) => {
				setExpanded(!expanded)
			}} className="circle-button subtle-expander-button" data-bs-toggle="collapse" href={"#" + collapseID} role="button" aria-expanded="false" aria-controls={collapseID}>
				<img className={styling} src="./../../../assets/symbols/arrow.svg"/>
			</button>
			<h3 className="subtle-expander-text">{expanded ? open : close}</h3>
			<div className="collapse subtle-expander-content" id={collapseID}>
				{children}
			</div>
		</div>
	);
}

export default SubtleExpander;
