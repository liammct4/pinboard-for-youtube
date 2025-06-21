/// <reference types="vite-plugin-svgr/client" />

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ThemeContext } from "../../../../../context/theme";
import { FormStyleContext } from "../../../../../components/input/formStyleContext";
import { IAppTheme, ColourPalette, ColourPaletteColours } from "../../../../../lib/config/theming/appTheme";
import { toTitleCase } from "../../../../../lib/util/generic/stringUtil";
import ArrowIcon from "./../../../../../../assets/symbols/arrows/arrowhead.svg?react"
import { IconContainer } from "../../../../../components/images/svgAsset";
import { ActionMessageDialog } from "../../../../../components/dialogs/ActionDialogMessage";
import "./AppearanceCustom.css"
import { ValidatedForm } from "../../../../../components/forms/ValidatedForm";
import { TextInput } from "../../../../../components/input/TextInput/TextInput";
import { ColourInput } from "../../../../../components/input/ColourInput/ColourInput";

interface IEditThemeForm extends ColourPalette {
	name: string;
}

export function AppearanceCustom(): React.ReactNode {
	const { themes, customThemes, currentTheme, actions: { addCustomTheme, deleteCustomTheme, setCurrentTheme } } = useContext(ThemeContext);
	const { id } = useParams();
	const navigate = useNavigate();
	const editingTheme: IAppTheme | undefined = useMemo(() => customThemes.find(x => x.name == id), [customThemes]);
	const submitButton = useRef<HTMLInputElement>(null!);
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
								submitButton.current.click();
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
				<ValidatedForm
					className="edit-theme-form"
					name="edit-custom-theme-form"
					fieldData={[
						{
							name: "name",
							validator: (value: string) => {
								if ([ ...customThemes, ...themes ].find(x => x.name == value) != undefined && editingTheme.name != value) {
									return {
										error: true,
										details: {
											name: "name",
											message: `Theme with the name ${value} already exists. Please choose a different name.`
										}
									}
								}

								return { error: false };
							}
						}
					]}
					onSuccess={handlerBase}>
					<FormStyleContext.Provider value={{ labelSize: "very large" }}>
						<TextInput
							name="name"
							label="Theme name"
							fieldSize="medium"
							startValue={editingTheme.name}
							/>
						{Object.keys(editingTheme.palette).map(x => 
							<ColourInput<ColourPaletteColours>
								key={x}
								name={x as ColourPaletteColours}
								label={toTitleCase(x.replace(/\-/g, " "))}
								fieldSize="very small"
								startValue={editingTheme.palette[x as ColourPaletteColours]}/>
						)}
					</FormStyleContext.Provider>
				</ValidatedForm>
				<div className="save-changes-bar">
					<input className="button-base button-small" type="submit" value="Save Changes" form="edit-custom-theme-form" ref={submitButton}/>
					{updateVisible ? <span className="confirmation-text">Changes Saved!</span> : <></>}
				</div>
			</>}
		</div>
	);
}
