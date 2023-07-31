import * as Dialog from "@radix-ui/react-dialog"
import Cross from "./../../../assets/symbols/cross.svg"
import "./../../styles/dialog.css"

export interface IDialogBoxProperties {
	title: string;
	trigger: React.ReactNode;
	description?: string;
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
				<Dialog.Overlay className="dialog-overlay" />
				<Dialog.Content className="pfy-style-context dialog-body">
					<Dialog.Title className="dialog-header">{title}</Dialog.Title>
					{description != "" && description != null ? <Dialog.Description className="dialog-description">{description}</Dialog.Description> : <></>}
					<div className="dialog-content">
						{children}
					</div>
					<Dialog.Close asChild>
						<button type="button" className="circle-button close-button" aria-label="Close">
							<img src={Cross} alt="Cancel and close popup."/>
						</button>
					</Dialog.Close>
					<div className="dialog-footer">{footer}</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
