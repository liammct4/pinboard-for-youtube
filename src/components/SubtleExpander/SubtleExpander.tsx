import { useState, useRef, useEffect, MutableRefObject } from "react"
import { v4 as uuidv4 } from "uuid";
import "./SubtleExpander.css"

export interface ISubtleExpanderProperties {
	openMessage: string,
	closeMessage: string,
	children: React.ReactNode
}

export function SubtleExpander({ openMessage, closeMessage, children }: ISubtleExpanderProperties): React.ReactNode {
	const [expanded, setExpanded] = useState(false);
	const collapseID: MutableRefObject<string> = useRef("se-" + uuidv4());

	// You cannot set "href" on a button element (e.g. <button href={"#" + collapseID}/>) because it isn't
	// supported with Typescript, so href needs to be set manually within the useEffect hook below in order
	// to get the Bootstrap expander to work. This also applies to other attributes such as data-bs-toggle.
	//
	// See: https://stackoverflow.com/questions/73949291/how-to-use-href-with-typescript
	const expandButtonRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		expandButtonRef.current!.setAttribute("href", `#${collapseID.current}`);
		expandButtonRef.current!.setAttribute("data-bs-toggle", "collapse");
		expandButtonRef.current!.setAttribute("aria-expanded", "false");
		expandButtonRef.current!.setAttribute("aria-controls", collapseID.current);
	}, []);

	let styling: string = "subtle-expander-symbol " + (expanded ? "rotate-close" : "rotate-open");

	return (
		<div className="subtle-expander-inner">
			<button type="button" title={expanded ? openMessage : closeMessage} onClick={() => {
				setExpanded(!expanded)
			}} ref={expandButtonRef} className="circle-button subtle-expander-button" data-bs-toggle="collapse" role="button">
				<img className={styling} src="./../../../assets/symbols/arrow.svg"/>
			</button>
			<h3 className="subtle-expander-text">{expanded ? openMessage : closeMessage}</h3>
			<div className="collapse subtle-expander-content" id={collapseID.current}>
				{children}
			</div>
		</div>
	);
}

export default SubtleExpander;
