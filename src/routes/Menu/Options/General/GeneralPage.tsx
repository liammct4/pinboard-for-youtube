import { useDispatch, useSelector } from "react-redux";
import { FormField } from "../../../../components/forms/FormField/FormField";
import { IErrorFieldValues, useValidatedForm } from "../../../../components/forms/validated-form";
import { RootState } from "../../../../app/store";
import { FormStyleContext } from "../../../../components/input/formStyleContext";
import { SplitHeading } from "../../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { useCallback } from "react";
import "./GeneralPage.css"
import { settingDefinitions, Settings } from "../../../../lib/config/settings";
import { settingsActions } from "../../../../features/settings/settingsSlice";
import { settingsLayout } from "./settingsLayout";

interface ISettingsForm extends Settings, IErrorFieldValues { }

export function GeneralPage(): React.ReactNode {
	let dispatch = useDispatch();
	let settingValues = useSelector((state: RootState) => state.settings.settings);
	const onSaveSettings = useCallback((data: ISettingsForm) => {
		delete data.error;

		dispatch(settingsActions.setSettings(data));
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
								case "Heading":
									return <SplitHeading key={x.message} text={x.message!} type={x.style}/>
								case "Separator":
									return <hr className="regular-separator"/>
							}


							let settingDefinition = settingDefinitions[x.fieldName];
							let existingValue = settingValues[x.fieldName];

							return <FormField
								key={x.fieldName}
								fieldSize="medium"
								label={settingDefinition.displayName}
								name={x.fieldName}
								register={register}
								selector={(data: ISettingsForm) => data[x.fieldName].toString()}
								submitEvent={submit.current}
								// @ts-ignore Not arbritary data, so no checks needed.
								inputType={settingDefinition.inputFormat}
								defaultValue={existingValue.toString()}
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
