/// <reference types="vite-plugin-svgr/client" />

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import CrossIcon from "./../../../assets/symbols/cross.svg?react"
import { IconContainer } from "../images/svgAsset";
import "./../../styling/dialog.css"

export type DialogClosedHandler = (result: string) => void;

export interface IMessageDialogProperties<T extends string> {
	title: string;
	body: string;
	buttons: T[];
	defaultFocusedButton: T;
	defaultMessage?: string;
	onButtonPressed: DialogClosedHandler;
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
export function ActionMessageDialog<T extends string>({ title, body, buttons, defaultFocusedButton, defaultMessage="Cancel", overrideOpen, onButtonPressed, children }: IMessageDialogProperties<T>): React.ReactNode {	
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
							<button type="button" className="circle-button close-button" aria-label="Cancel and close popup." onClick={() => onButtonPressed(defaultMessage)}>
								<IconContainer
									className="icon-colour-standard"
									asset={CrossIcon}
									use-stroke/>
							</button>
						</AlertDialog.Action>
					</div>
					<div className="inner-content-area">
						<AlertDialog.Description className="description">{body}</AlertDialog.Description>
					</div>
					<div className="bottom-footer">
						{buttons.map(x =>
							<AlertDialog.Action key={x} asChild>
								<button autoFocus={defaultFocusedButton == x} type="button" className="button-base button-small" onClick={() => onButtonPressed(x)}>{x}</button>
							</AlertDialog.Action>
						)}
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
