import { useDispatch, useSelector } from "react-redux";
import { FormField } from "../../../../components/forms/FormField/FormField";
import { IErrorFieldValues, useValidatedForm } from "../../../../components/forms/validated-form";
import settingDefinitions from "./../../../../lib/config/settingDefinitions.json"
import { RootState } from "../../../../app/store";
import { FormStyleContext } from "../../../../components/input/formStyleContext";
import settingsLayout from "./settingsLayout.json"
import { SplitHeading } from "../../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { useCallback } from "react";
import { SettingValue, setSettingValues } from "../../../../features/settings/settingsSlice";
import "./GeneralPage.css"

type SettingOption = "Heading" | "Field" | "Separator";
interface ISettingElement {
	type: SettingOption;
}

interface ISettingHeading extends ISettingElement {
	message: string;
	style: "bold" | "regular"
}

interface ISettingField extends ISettingElement {
	fieldName: "string";
}

interface ISettingSeparator extends ISettingElement { }

interface ISettingsForm extends IErrorFieldValues {
	timestampButtonsEnabled: boolean;
	saveVideoTimestampButtonEnabled: boolean;
	pinCurrentTimestampShortcut: string;
	useAutoSaveLatestTimestamp: boolean;	
	onlyBringAutoSavedTimestampForward: boolean;
	autoSaveLatestTimestampMessage: string;	
}

export function GeneralPage(): React.ReactNode {
	let dispatch = useDispatch();
	let settingValues = useSelector((state: RootState) => state.settings.settingValues);
	const onSaveSettings = useCallback((data: ISettingsForm) => {
		let settings: SettingValue[] = Object
			.keys(data)
			.filter(x => x != "error")
			.map(x => {				
				// See SwitchInput.tsx for reason for this.
				let matchingSettingDefinition = settingDefinitions.find(y => y.settingName == x);
				let newValue: string = data[x];

				if (matchingSettingDefinition?.inputFormat == "Switch" && newValue == undefined) {
					// Get the currently saved setting value, since it's unchanged.
					// data[x] being undefined means it has not changed. 
					newValue = settingValues.find(y => x == y.settingName)!.value;
				}

				return { settingName: x, value: newValue };
			});
		dispatch(setSettingValues(settings));
	}, []);
	let { handleSubmit, handler, register, submit } = useValidatedForm<ISettingsForm>(onSaveSettings);

	return (
		<>
			<FormStyleContext.Provider value={{
				labelSize: "very large"
			}}>
				<form className="modify-settings-form" id="modify-settings-form" onSubmit={handleSubmit(handler)}>
					{
						settingsLayout.map<React.ReactNode>(x => {
							switch (x.type)
							{
								case "heading":
									let heading = x as ISettingHeading;
									return <SplitHeading key={heading.message} text={heading.message!} type={heading.style}/>
								case "separator":
									return <hr className="regular-separator"/>
							}

							let field = x as ISettingField;

							let settingDefinition = settingDefinitions.find(y => y.settingName == field.fieldName)!;
							let existingValue = settingValues.find(y => y.settingName == settingDefinition.settingName)?.value.toString();

							return <FormField
								key={field.fieldName}
								fieldSize="medium"
								label={settingDefinition.displayName}
								name={settingDefinition.settingName}
								register={register}
								selector={(data: ISettingsForm) => data[settingDefinition.settingName]}
								submitEvent={submit.current}
								// @ts-ignore Not arbritary data, so no checks needed.
								inputType={settingDefinition.inputFormat}
								defaultValue={existingValue}
								validationMethod={() => { return null; }}/>
						})
					}
				</form>
				<hr className="bold-separator"/>
				<input className="modify-settings-button button-small button-base" type="submit" form="modify-settings-form" value="Save Changes"/>
			</FormStyleContext.Provider>
		</>
	);
}
