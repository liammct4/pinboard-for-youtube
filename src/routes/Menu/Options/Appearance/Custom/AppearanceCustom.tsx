/// <reference types="vite-plugin-svgr/client" />

import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { FormStyleContext } from "../../../../../components/input/formStyleContext";
import { ColourPalette, ColourPaletteColours, ICustomTheme } from "../../../../../lib/config/theming/appTheme";
import { toTitleCase } from "../../../../../lib/util/generic/stringUtil";
import ArrowIcon from "./../../../../../../assets/symbols/arrows/arrowhead.svg?react"
import { IconContainer } from "../../../../../components/images/svgAsset";
import { ActionMessageDialog } from "../../../../../components/dialogs/ActionDialogMessage";
import "./AppearanceCustom.css"
import { ValidatedForm } from "../../../../../components/forms/ValidatedForm";
import { TextInput } from "../../../../../components/input/TextInput/TextInput";
import { ColourInput } from "../../../../../components/input/ColourInput/ColourInput";
import { TemporaryText } from "../../../../../components/presentation/Decorative/TemporaryText/TemporaryText";
import { SmallButton, SmallInputButton } from "../../../../../components/interactive/buttons/SmallButton/SmallButton";
import { useTheme } from "../../../../../components/features/useTheme";
import { useDispatch } from "react-redux";
import { themeActions } from "../../../../../features/theme/themeSlice";

interface IEditThemeForm extends ColourPalette {
	name: string;
}

export function AppearanceCustom(): React.ReactNode {
	const { currentThemeData, customThemes, allThemes } = useTheme();
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const editingTheme: ICustomTheme | undefined = useMemo(() => customThemes.find(x => x.name == id), [customThemes]);
	const submitButton = useRef<HTMLInputElement>(null!);
	const handlerBase = (data: IEditThemeForm) => {
		let name = data.name;

		dispatch(themeActions.deleteCustomTheme(editingTheme!.id));

		let updatedTheme: ICustomTheme = {
			id: editingTheme!.id,
			name: name,
			palette: {
				...data
			},
			basedOn: editingTheme!.basedOn
		}
		
		dispatch(themeActions.addCustomTheme(updatedTheme));

		// Update interface if the current theme selected is being edited.
		if (name == currentThemeData.name) {
			dispatch(themeActions.setCurrentTheme(updatedTheme.id));
		}

		// Move the location to the new name.
		navigate(`../custom/${name}`);
		setUpdateVisible(true);
	};
	// For the confirmation message when the "Save changes" button is pressed. 
	const [ updateVisible, setUpdateVisible ] = useState<boolean>(false);
	

	return (
		<div className="custom-page-outer">
			{editingTheme == undefined ? <span className="doesnt-exist-error-message">Something went wrong...</span> :
			<>
				<div className="title-bar">
					<ActionMessageDialog
						title="Go back"
						body="Do you want to save changes made to the theme?"
						buttons={["Yes", "No", "Cancel"]}
						defaultFocusedButton="Yes"
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
							<SmallButton circle>
								<IconContainer
									asset={ArrowIcon}
									className="icon-colour-standard arrow-icon"
									use-stroke/>
							</SmallButton>
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
								if (allThemes.find(x => x.name == value) != undefined && editingTheme.name != value) {
									return {
										error: true,
										details: {
											name: "name",
											message: `Theme with the name "${value}" already exists.`
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
							title=""
							fieldSize="medium"
							startValue={editingTheme.name}
							/>
						{Object.keys(editingTheme.palette).filter(x => x != "name").map(x => 
							<ColourInput<ColourPaletteColours>
								key={x}
								name={x as ColourPaletteColours}
								label={toTitleCase(x.replace(/\-/g, " "))}
								title={toTitleCase(x.replace(/\-/g, " "))}
								fieldSize="very small"
								startValue={editingTheme.palette[x as ColourPaletteColours]}/>
						)}
					</FormStyleContext.Provider>
				</ValidatedForm>
				<div className="save-changes-bar">
					<SmallInputButton type="submit" value="Save Changes" form="edit-custom-theme-form" ref={submitButton}/>
					<TemporaryText
						className="temporary-red"
						visibleTime={6000}
						textVisible={updateVisible}
						setTextVisible={setUpdateVisible}>
							Changes Saved!
					</TemporaryText>
				</div>
			</>}
		</div>
	);
}
