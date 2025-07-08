/// <reference types="vite-plugin-svgr/client" />

import * as Dialog from "@radix-ui/react-dialog"
import CrossIcon from "./../../../assets/symbols/cross.svg?react"
import { IconContainer } from "../images/svgAsset";
import "./../../styling/dialog.css"
import { SmallButton } from "../interactive/buttons/SmallButton/SmallButton";
import { StyleContextWrapper } from "../features/styleContext/StyleContextWrapper";
import { useContext } from "react";
import { DragListControllerContext } from "../interactive/dragList/DragListController";

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
	const { setActive } = useContext(DragListControllerContext);
	
	return (
		<Dialog.Root onOpenChange={(open) => setActive(!open)}>
			<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="dialog-background-overlay"/>
				<Dialog.Content className="dialog-body">
					<StyleContextWrapper update-theme>
						<div className="top-header">
							<Dialog.Title className="title">{title}</Dialog.Title>
							<Dialog.Close asChild>
								<SmallButton circle type="button" className="close-button" aria-label="Close">
									<IconContainer
										className="icon-colour-standard"
										asset={CrossIcon}
										use-stroke/>
								</SmallButton>
							</Dialog.Close>
						</div>
						<div className="inner-content-area">
							{description != "" && description != null ? <Dialog.Description className="description">{description}</Dialog.Description> : <></>}
							<div className="content">
								{children}
							</div>
						</div>
						<div className="bottom-footer">{footer}</div>
					</StyleContextWrapper>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
