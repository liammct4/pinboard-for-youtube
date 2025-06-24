import React, { useState } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import "./../../../styling/elements/expander.css"
import "./TwoToggleLayoutExpander.css"
import { SmallButton } from "../../interactive/buttons/SmallButton/SmallButton";

export interface ITwoToggleLayoutExpanderProperties {
	className?: string;
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
	content?: React.ReactNode;
}

export function TwoToggleLayoutExpander({
		className,
		expanded,
		onExpandedEvent,
		openMessage,
		closeMessage,
		openTooltip,
		closeTooltip,
		children,
		openButtonContent,
		closeButtonContent,
		align,
		content
	}: ITwoToggleLayoutExpanderProperties): React.ReactNode {
	return (
		<Collapsible.Root open={expanded}>
			<div className={`${className} expander-inner`} data-align={align ?? "left"}>
				<Collapsible.Trigger asChild>
					<SmallButton
						className="layout-option-button"
						type="button"
						title={openTooltip}
						onClick={() => onExpandedEvent?.(true)}
						data-active={expanded}
						square>
							{openButtonContent}
					</SmallButton>
				</Collapsible.Trigger>
				<Collapsible.Trigger asChild>
					<SmallButton
						className="layout-option-button"
						type="button"
						title={closeTooltip}
						onClick={() => onExpandedEvent?.(false)}
						data-active={!expanded}
						square>
							{closeButtonContent}
					</SmallButton>
				</Collapsible.Trigger>
				{
					content ??
						<h3 className="message-text">{expanded ? openMessage : closeMessage}</h3>
				}
			</div>
			<Collapsible.Content className="expander-content" data-expander-use-slide-animation>
				{children}
			</Collapsible.Content>
		</Collapsible.Root>
	);
}
