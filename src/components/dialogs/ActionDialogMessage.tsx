import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Cross from "./../../../assets/symbols/cross.svg"
import "./../../styles/dialog.css"

export type DialogClosedHandler = (result: string) => void;

export interface IMessageDialogProperties {
	title: string;
	body: string;
	buttons: Array<string>;
	defaultMessage?: string;
	onButtonPressed: DialogClosedHandler;
	children: React.ReactNode;
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
export function ActionMessageDialog({ title, body, buttons, defaultMessage="Cancel", onButtonPressed, children }: IMessageDialogProperties): React.ReactNode {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>
				{children}
			</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="dialog-overlay" />
				<AlertDialog.Content className="pfy-style-context dialog-body">
					<AlertDialog.Title className="dialog-header">{title}</AlertDialog.Title>
					<AlertDialog.Description className="dialog-content dialog-description">
						{body}
					</AlertDialog.Description>
					<AlertDialog.Action asChild>
						<button type="button" className="circle-button close-button" aria-label="Cancel and close popup." onClick={() => onButtonPressed(defaultMessage)}>
							<img src={Cross}/>
						</button>
					</AlertDialog.Action>
					<div className="dialog-footer">
						{buttons.map(x =>
							<AlertDialog.Action key={x} asChild>
								<button type="button" className="button-small" onClick={() => onButtonPressed(x)}>{x}</button>
							</AlertDialog.Action>
						)}
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}

export default ActionMessageDialog;
