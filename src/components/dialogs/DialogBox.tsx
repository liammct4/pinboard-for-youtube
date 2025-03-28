/// <reference types="vite-plugin-svgr/client" />

import * as Dialog from "@radix-ui/react-dialog"
import CrossIcon from "./../../../assets/symbols/cross.svg?react"
import { IconContainer } from "../images/svgAsset";
import "./../../styling/dialog.css"

export interface IDialogBoxProperties {
	title: string;
	trigger: React.ReactNode;
	description?: React.ReactNode;
	footer: React.ReactNode
	children: React.ReactNode;
}

/**
 * A generic dialog box which allows for complete customization.
 * @param title The title of the dialog displayed at the top.
 * @param description A short paragraph displayed below the header describing the dialog. Leave null to not include.
 * @param trigger A provided button which will open the dialog.
 * @param footer A customizable JSX snippet which will be displayed in the footer section.
 */
export function DialogBox({ title, trigger, description, footer, children }: IDialogBoxProperties): React.ReactNode {
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="dialog-background-overlay"/>
				<Dialog.Content className="dialog-body pfy-style-context">
					<div className="top-header">
						<Dialog.Title className="title">{title}</Dialog.Title>
						<Dialog.Close asChild>
							<button type="button" className="circle-button close-button" aria-label="Close">
								<IconContainer
									className="icon-colour-standard"
									asset={CrossIcon}
									use-stroke/>
							</button>
						</Dialog.Close>
					</div>
					<div className="inner-content-area">
						{description != "" && description != null ? <Dialog.Description className="description">{description}</Dialog.Description> : <></>}
						<div className="content">
							{children}
						</div>
					</div>
					<div className="bottom-footer">{footer}</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
