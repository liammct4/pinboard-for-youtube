import { useState, useRef, useEffect, MutableRefObject } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import "./SubtleExpander.css"

export interface ISubtleExpanderProperties {
	openMessage: string,
	closeMessage: string,
	children: React.ReactNode
}

export function SubtleExpander({ openMessage, closeMessage, children }: ISubtleExpanderProperties): React.ReactNode {
	const [expanded, setExpanded] = useState(false);

	return (
		<Collapsible.Root open={expanded} onOpenChange={setExpanded}>
			<div className="subtle-expander-inner">
				<Collapsible.Trigger asChild>
					<button type="button" className="circle-button subtle-expander-button">
						<img className="subtle-expander-arrow" data-state={expanded} src="./../../../assets/symbols/arrow.svg"/>
					</button>
				</Collapsible.Trigger>
				<h3 className="subtle-expander-text">{expanded ? openMessage : closeMessage}</h3>
			</div>
			<Collapsible.Content className="subtle-expander-content">
				{children}
			</Collapsible.Content>
		</Collapsible.Root>
	);
}

export default SubtleExpander;
