import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { FormStyleContext } from "../../../../components/input/formStyleContext";
import { SplitHeading } from "../../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { useCallback, useState } from "react";
import "./GeneralPage.css"
import { settingDefinitions, Settings } from "../../../../lib/config/settings";
import { settingsActions } from "../../../../features/settings/settingsSlice";
import { settingsLayout } from "./settingsLayout";
import { ValidatedForm } from "../../../../components/forms/ValidatedForm";
import { getInputComponent } from "../../../../components/input/componentLocator";
import { TemporaryText } from "../../../../components/presentation/Decorative/TemporaryText/TemporaryText";

interface ISettingsForm extends Settings { }

export function GeneralPage(): React.ReactNode {
	let dispatch = useDispatch();
	let settingValues = useSelector((state: RootState) => state.settings.settings);
	const [ saveChangesVisible, setSaveChangesVisible ] = useState<boolean>(false);
	const onSaveSettings = useCallback((data: ISettingsForm) => {
		dispatch(settingsActions.setSettings(data));
		setSaveChangesVisible(true);
	}, []);

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

							let InputComponent = getInputComponent(settingDefinition.inputFormat);

							return <InputComponent
								key={x.fieldName}
								fieldSize="medium"
								label={settingDefinition.displayName}
								name={x.fieldName}
								startValue={existingValue.toString()}/>
						})
					}
				</ValidatedForm>
				<hr className="bold-separator"/>
				<div className="save-changes-row">
					<input className="modify-settings-button button-small button-base" type="submit" form="modify-settings-form" value="Save Changes"/>
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
