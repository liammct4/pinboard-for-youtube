/// <reference types="vite-plugin-svgr/client" />

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ThemeContext } from "../../../../../context/theme";
import { FormStyleContext } from "../../../../../components/input/formStyleContext";
import { IAppTheme, ColourPalette } from "../../../../../lib/config/theming/appTheme";
import { FormField } from "../../../../../components/forms/FormField/FormField";
import { toTitleCase } from "../../../../../lib/util/generic/stringUtil";
import { IErrorFieldValues, useValidatedForm } from "../../../../../components/forms/validated-form";
import ArrowIcon from "./../../../../../../assets/symbols/arrows/arrowhead.svg?react"
import { IconContainer } from "../../../../../components/images/svgAsset";
import { ActionMessageDialog } from "../../../../../components/dialogs/ActionDialogMessage";
import "./AppearanceCustom.css"

interface IEditThemeForm extends ColourPalette, IErrorFieldValues {
	name: string;
}

export function AppearanceCustom(): React.ReactNode {
	const { themes, customThemes, currentTheme, actions: { addCustomTheme, deleteCustomTheme, setCurrentTheme } } = useContext(ThemeContext);
	const { id } = useParams();
	const navigate = useNavigate();
	const editingTheme: IAppTheme | undefined = useMemo(() => customThemes.find(x => x.name == id), [customThemes]);
	const handlerBase = useCallback((data: IEditThemeForm) => {
		let name = data.name;

		// @ts-ignore
		delete data.error;
		// @ts-ignore
		delete data.name;

		deleteCustomTheme(editingTheme!.id);

		let updatedTheme: IAppTheme = {
			id: editingTheme!.id,
			name: name,
			palette: {
				...data
			},
			modifiable: true
		}
		
		addCustomTheme(updatedTheme);

		// Update interface if the current theme selected is being edited.
		if (name == currentTheme.name) {
			setCurrentTheme(updatedTheme);
		}

		// Move the location to the new name.
		navigate(`../custom/${name}`);
		setUpdateVisible(true);
	}, []);
	const { register, handleSubmit, handler, submit } = useValidatedForm<IEditThemeForm>(handlerBase);
	// For the confirmation message when the "Save changes" button is pressed. 
	const [ updateVisible, setUpdateVisible ] = useState<boolean>(false);
	useEffect(() => {
		if (updateVisible == true) {
			setTimeout(() => {
				setUpdateVisible(false);
			}, 6000);
		}
	}, [updateVisible]);

	return (
		<div className="custom-page-outer">
			{editingTheme == undefined ? <span className="doesnt-exist-error-message">Something went wrong...</span> :
			<>
				<div className="title-bar">
					<ActionMessageDialog
						title="Go back"
						body="Do you want to save changes made to the theme?"
						buttons={["Yes", "No", "Cancel"]}
						defaultMessage="Cancel"
						onButtonPressed={(action: string) => {
							if (action == "Cancel") {
								return;
							}

							if (action == "Yes") {
								handleSubmit(handler)();
							}

							setTimeout(() => navigate(".."), 10);
						}}>
							<button className="circle-button">
								<IconContainer
									asset={ArrowIcon}
									className="icon-colour-standard arrow-icon"
									use-stroke/>
							</button>
					</ActionMessageDialog>
					<h3 className="theme-title">{editingTheme.name}</h3>
				</div>
				<hr className="bold-separator"/>
				<form className="edit-theme-form" id={`edit-custom-theme-form`} onSubmit={handleSubmit(handler)}>
					<FormStyleContext.Provider value={{ labelSize: "large" }}>
						<FormField<IEditThemeForm>
							name="name"
							label="Theme name"
							fieldSize="medium"
							register={register}
							submitEvent={submit.current}
							selector={(data: IEditThemeForm) => data.name}
							inputType="Text"
							// @ts-ignore
							defaultValue={editingTheme.name}
							validationMethod={(value: string) => {
								if ([ ...customThemes, ...themes ].find(x => x.name == value) != undefined && editingTheme.name != value) {
									return `Theme with the name ${value} already exists. Please choose a different name.`
								}

								return null;
							}}
							/>
						{Object.keys(editingTheme.palette).map(x => 
							<FormField<IEditThemeForm>
								key={x}
								name={x}
								label={toTitleCase(x.replace(/\-/g, " "))}
								fieldSize="max"
								register={register}
								submitEvent={submit.current}
								selector={(data: IEditThemeForm) => data[x]}
								inputType="Colour"
								// @ts-ignore
								defaultValue={editingTheme.palette[x]}
								/>
						)}
					</FormStyleContext.Provider>
				</form>
				<div className="save-changes-bar">
					<input className="button-base button-small" type="submit" value="Save Changes" form="edit-custom-theme-form"/>
					{updateVisible ? <span className="confirmation-text">Changes Saved!</span> : <></>}
				</div>
			</>}
		</div>
	);
}
