/// <reference types="vite-plugin-svgr/client" />

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import CrossIcon from "./../../../assets/symbols/cross.svg?react"
import { IconContainer } from "../images/svgAsset";
import "./../../styling/dialog.css"
import { SmallButton } from "../interactive/buttons/SmallButton/SmallButton";
import { ButtonPanel } from "../interactive/ButtonPanel/ButtonPanel";

export type DialogClosedHandler<T> = (result: T) => void;

export interface IMessageDialogProperties<T extends string> {
	title: string;
	body: string;
	buttons: T[];
	defaultFocusedButton: T;
	defaultMessage: T;
	onButtonPressed: DialogClosedHandler<T>;
	overrideOpen?: boolean | undefined;
	children?: React.ReactNode;
}

/**
 * A component which shows a dialog prompt to the user with a provided list of specificed actions.
 * @param title The title at the top of the dialog.
 * @param body The main text of the dialog.
 * @param buttons An array of strings which show up as buttons at the bottom of the dialog in chronological order. E.g. [ "Yes", "No", "Cancel" ].
 * @param defaultMessage The default action to return whenever the close button is pressed in the top right. The default is "Cancel."
 * @param onButtonPressed A function which has a string parameter, whenever the user clicks on an option, the function will be ran with the chosen option. (This is case sensitive).
 * @param children The button trigger when when pressed, will open the dialog.
 */
export function ActionMessageDialog<T extends string>({ title, body, buttons, defaultFocusedButton, defaultMessage, overrideOpen, onButtonPressed, children }: IMessageDialogProperties<T>): React.ReactNode {	
	return (
		<AlertDialog.Root open={overrideOpen}>
			<AlertDialog.Trigger asChild>
				{children}
			</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="dialog-background-overlay"/>
				<AlertDialog.Content className="dialog-body pfy-style-context">
					<div className="top-header">
						<AlertDialog.Title className="title">{title}</AlertDialog.Title>
						<AlertDialog.Action asChild>
							<SmallButton circle type="button" className="close-button" aria-label="Cancel and close popup." onClick={() => onButtonPressed(defaultMessage)}>
								<IconContainer
									className="icon-colour-standard"
									asset={CrossIcon}
									use-stroke/>
							</SmallButton>
						</AlertDialog.Action>
					</div>
					<div className="inner-content-area">
						<AlertDialog.Description className="description">{body}</AlertDialog.Description>
					</div>
					<ButtonPanel className="bottom-footer">
						{buttons.map(x =>
							<AlertDialog.Action key={x} asChild>
								<SmallButton autoFocus={defaultFocusedButton == x} type="button" onClick={() => onButtonPressed(x)}>{x}</SmallButton>
							</AlertDialog.Action>
						)}
					</ButtonPanel>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
