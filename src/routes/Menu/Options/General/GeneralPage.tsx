import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { FormStyleContext } from "../../../../components/input/formStyleContext";
import { SplitHeading } from "../../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { useState } from "react";
import "./GeneralPage.css"
import { settingDefinitions, SettingName, Settings } from "../../../../lib/config/settings";
import { settingsActions } from "../../../../features/settings/settingsSlice";
import { settingsLayout } from "./settingsLayout";
import { ValidatedForm } from "../../../../components/forms/ValidatedForm";
import { getInputComponent } from "../../../../components/input/componentLocator";
import { TemporaryText } from "../../../../components/presentation/Decorative/TemporaryText/TemporaryText";
import { SmallInputButton } from "../../../../components/interactive/buttons/SmallButton/SmallButton";
import { DropdownInput } from "../../../../components/input/DropdownInput/DropdownInput";
import { IInputComponentProperties } from "../../../../components/input/inputComponent";

interface ISettingsForm extends Settings { }

export function GeneralPage(): React.ReactNode {
	let dispatch = useDispatch();
	let settingValues = useSelector((state: RootState) => state.settings.settings);
	const [ saveChangesVisible, setSaveChangesVisible ] = useState<boolean>(false);
	const onSaveSettings = (data: ISettingsForm) => {
		dispatch(settingsActions.setSettings(data));
		setSaveChangesVisible(true);
	}

	return (
		<>
			<FormStyleContext.Provider value={{
				labelSize: "very large"
			}}>
				<ValidatedForm
					className="modify-settings-form"
					name="modify-settings-form"
					onSuccess={onSaveSettings}>
					{
						settingsLayout.map<React.ReactNode>(x => {
							switch (x.type)
							{
								case "Heading":
									return <SplitHeading key={x.message} text={x.message!} type={x.style}/>
								case "Separator":
									return <hr className="regular-separator"/>
							}

							let settingDefinition = settingDefinitions[x.fieldName];
							let existingValue = settingValues[x.fieldName];

							let baseProps: IInputComponentProperties<SettingName> = {
								fieldSize: "medium",
								label: settingDefinition.displayName,
								title: settingDefinition.description,
								name: x.fieldName,
								startValue: existingValue.toString()
							}

							switch (settingDefinition.inputFormat) {
								case "Dropdown":
									return <DropdownInput {...baseProps} options={settingDefinition.options}/>
								default:
									let InputComponent = getInputComponent(settingDefinition.inputFormat);

									return <InputComponent {...baseProps}/>
							}
						})
					}
				</ValidatedForm>
				<hr className="bold-separator"/>
				<div className="save-changes-row">
					<SmallInputButton className="modify-settings-button" type="submit" form="modify-settings-form" value="Save Changes"/>
					<TemporaryText
						className="temporary-red"
						textVisible={saveChangesVisible}
						setTextVisible={setSaveChangesVisible}
						visibleTime={6000}>
							Changes Saved!
					</TemporaryText>
				</div>
			</FormStyleContext.Provider>
		</>
	);
}
