import { useState } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import "./../../../styling/elements/expander.css"
import "./TwoToggleLayoutExpander.css"

export interface ITwoToggleLayoutExpanderProperties {
	expanded: boolean;
	onExpandedEvent?: (open: boolean) => void;
	openMessage?: string;
	closeMessage?: string;
	openTooltip?: string;
	closeTooltip?: string;
	children: React.ReactNode;
	openButtonContent: React.ReactNode;
	closeButtonContent: React.ReactNode;
	align?: "left" | "middle" | "right";
}

export function TwoToggleLayoutExpander({
		expanded,
		onExpandedEvent,
		openMessage,
		closeMessage,
		openTooltip,
		closeTooltip,
		children,
		openButtonContent,
		closeButtonContent,
		align
	}: ITwoToggleLayoutExpanderProperties): React.ReactNode {
	let [isExpanded, setExpanded] = useState(expanded);

	return (
		<Collapsible.Root open={isExpanded} onOpenChange={(() => isExpanded)}>
			<div className="expander-inner" data-align={align ?? "left"}>
				<Collapsible.Trigger asChild>
					<button
						className="layout-option-button button-base button-small square-button"
						type="button"
						title={openTooltip}
						onClick={() => {
							setExpanded(true)

							if (onExpandedEvent != null) {
								onExpandedEvent(true);
							}
						}}
						data-active={isExpanded}>
							{openButtonContent}
					</button>
				</Collapsible.Trigger>
				<Collapsible.Trigger asChild>
					<button
						className="layout-option-button button-base button-small square-button"
						type="button"
						title={closeTooltip}
						onClick={() => {
							setExpanded(false);
						
							if (onExpandedEvent != null) {
								onExpandedEvent(false);
							}
						}}
						data-active={!isExpanded}>
							{closeButtonContent}
					</button>
				</Collapsible.Trigger>
				<h3 className="message-text">{isExpanded ? openMessage : closeMessage}</h3>
			</div>
			<Collapsible.Content className="expander-content" data-expander-use-slide-animation>
				{children}
			</Collapsible.Content>
		</Collapsible.Root>
	);
}
