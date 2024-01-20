import * as Dialog from "@radix-ui/react-dialog"
import { DialogBox } from "./DialogBox";
import { FormStyleContext, SizeOption } from "../input/formStyleContext";
import "./FormDialog.css"

export interface IFormDialogProperties {
	formID: string;
	formTitle: string;
	submitText: string;
	labelSize: SizeOption;
	description?: React.ReactNode;
	trigger: React.ReactNode;
	children: React.ReactNode
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

/**
 * A template which shows a form in a popup dialog box.
 * @param formID The ID of the form. Unique to each form type. E.g. "edit-form"
 * @param formTitle The title to be displayed at the top of the dialog.
 * @param submitText The text to be displayed in the submit button of the form.
 * @param description A short paragraph to be displayed at the top of the dialog describing the form. Leave blank or null to have no description.
 * @param trigger A JSX snippet containing a button, when pressed, the dialog will open.
 * @param handleSubmit Handler which is triggered when the form is submitted.
 */
export function FormDialog({
		formID,
		formTitle,
		submitText,
		description,
		labelSize,
		trigger,
		handleSubmit,
		children
	}: IFormDialogProperties): React.ReactNode {

	return (
		<DialogBox
			title={formTitle}
			trigger={trigger}
			description={description}
			footer={
				<>
					<input type="submit" value={submitText} form={formID} className="button-base button-small"></input>
					<Dialog.Close className="button-base button-small">Close</Dialog.Close>
				</>
			}>
			<form className="dialog-form" id={formID} onSubmit={handleSubmit}>
				<FormStyleContext.Provider value={{ labelSize: labelSize }}>
					{children}
				</FormStyleContext.Provider>
			</form>
		</DialogBox>
	);
}

export default FormDialog;
