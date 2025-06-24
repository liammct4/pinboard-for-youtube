/// <reference types="vite-plugin-svgr/client" />

import { useState } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import ArrowIcon from "./../../../../assets/symbols/arrows/arrowhead.svg?react"
import { IconContainer } from "../../images/svgAsset";
import "./../../../styling/elements/expander.css"
import "./LabeledArrowExpander.css"
import { SmallButton } from "../../interactive/buttons/SmallButton/SmallButton";

export interface ILabeledArrowExpanderProperties {
	className?: string;
	expanded: boolean;
	onExpanded?: (open: boolean) => void;
	openMessage: string;
	closeMessage: string;
	children: React.ReactNode;
}

export function LabeledArrowExpander({ className, expanded, onExpanded, openMessage, closeMessage, children }: ILabeledArrowExpanderProperties): React.ReactNode {
	// The state and modification of the state of the expander is left up to the parent component.
	// However, if no onExpanded is provided, then the component will manage its own state with this useState.
	let [isExpanded, setExpanded] = useState(expanded);

	return (
		<Collapsible.Root className={className} open={onExpanded == null ? isExpanded : expanded} onOpenChange={onExpanded ?? setExpanded}>
			<div className="expander-inner">
				<Collapsible.Trigger asChild>
					<SmallButton circle type="button" className="expander-control-button">
						<div className="indicator-arrow-wrapper" data-state={expanded}>
							<IconContainer
								asset={ArrowIcon}
								className="icon-colour-standard"
								data-state={expanded}
								use-stroke/>
						</div>
					</SmallButton>
				</Collapsible.Trigger>
				<h3 className="message-text">{expanded ? openMessage : closeMessage}</h3>
			</div>
			<Collapsible.Content className="expander-content" data-expander-use-slide-animation>
				{children}
			</Collapsible.Content>
		</Collapsible.Root>
	);
}

