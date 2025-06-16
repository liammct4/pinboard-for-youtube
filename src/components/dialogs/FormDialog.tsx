import * as Dialog from "@radix-ui/react-dialog"
import { DialogBox } from "./DialogBox";
import { FormStyleContext, SizeOption } from "../input/formStyleContext";
import "./FormDialog.css"
import { IValidatedFormProperties, ValidatedForm } from "../forms/ValidatedForm";

export interface IFormDialogProperties<TForm, TField extends string> extends IValidatedFormProperties<TForm, TField> {
	title: string;
	submitText: string;
	labelSize: SizeOption;
	description?: React.ReactNode;
	trigger: React.ReactNode;
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
export function FormDialog<TForm, TField extends string>({
		name,
		title,
		fieldData,
		onSuccess,
		onError,
		submitText,
		description,
		labelSize,
		trigger,
		children
	}: IFormDialogProperties<TForm, TField>): React.ReactNode {

	return (
		<DialogBox
			title={title}
			trigger={trigger}
			description={description}
			footer={
				<>
					<input type="submit" value={submitText} form={name} className="button-base button-small"/>
					<Dialog.Close className="button-base button-small">Close</Dialog.Close>
				</>
			}>
			<ValidatedForm
				className="dialog-form"
				name={name}
				fieldData={fieldData}
				onSuccess={onSuccess}
				onError={onError}
			>
				<FormStyleContext.Provider value={{ labelSize: labelSize }}>
					{children}
				</FormStyleContext.Provider>
			</ValidatedForm>
		</DialogBox>
	);
}
