import { useState, useRef, useEffect, MutableRefObject } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import "./SubtleExpander.css"

export interface ISubtleExpanderProperties {
	expanded: boolean;
	onExpanded: (open: boolean) => void;
	openMessage: string;
	closeMessage: string;
	children: React.ReactNode;
}

export function SubtleExpander({ expanded, onExpanded, openMessage, closeMessage, children }: ISubtleExpanderProperties): React.ReactNode {
	// The state and modification of the state of the expander is left up to the parent component.
	// However, if no onExpanded is provided, then the component will manage its own state with this useState.
	let [isExpanded, setExpanded] = useState(expanded);

	return (
		<Collapsible.Root open={onExpanded == null ? isExpanded : expanded} onOpenChange={onExpanded ?? setExpanded}>
			<div className="expander-inner">
				<Collapsible.Trigger asChild>
					<button type="button" className="circle-button expander-control-button">
						<img className="indicator-arrow" data-state={expanded} src="./../../../assets/symbols/arrow.svg"/>
					</button>
				</Collapsible.Trigger>
				<h3 className="message-text">{expanded ? openMessage : closeMessage}</h3>
			</div>
			<Collapsible.Content className="expander-content">
				{children}
			</Collapsible.Content>
		</Collapsible.Root>
	);
}

export default SubtleExpander;
