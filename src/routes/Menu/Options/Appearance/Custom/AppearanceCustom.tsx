import { useCallback, useContext, useMemo } from "react";
import { useParams } from "react-router-dom"
import { ThemeContext } from "../../../../../context/theme";
import { FormStyleContext } from "../../../../../components/input/formStyleContext";
import { AppTheme, ColourPalette } from "../../../../../lib/config/theming/appTheme";
import { FormField } from "../../../../../components/forms/FormField/FormField";
import { toTitleCase } from "../../../../../lib/util/generic/stringUtil";
import { IErrorFieldValues, useValidatedForm } from "../../../../../components/forms/validated-form";
import { InputMethodType } from "../../../../../lib/config/configurationOption";
import "./AppearanceCustom.css"

interface IEditThemeForm extends ColourPalette, IErrorFieldValues { }

export function AppearanceCustom(): React.ReactNode {
	const { customThemes, actions: { addCustomTheme } } = useContext(ThemeContext);
	const { id } = useParams();
	const editingTheme: AppTheme | undefined = useMemo(() => customThemes.find(x => x.name == id), [customThemes]);
	const handlerBase = useCallback((data: IEditThemeForm) => {
		// @ts-ignore
		delete data.error;

		let updatedTheme: AppTheme = {
			name: editingTheme!.name!,
			palette: {
				...data
			},
			modifiable: true
		}
		
		addCustomTheme(updatedTheme);
	}, []);
	const { register, handleSubmit, handler, submit } = useValidatedForm<IEditThemeForm>(handlerBase);

	return (
		<div className="custom-page-outer">
			{editingTheme == undefined ? <span className="doesnt-exist-error-message">Something went wrong...</span> :
			<>
				<h3 className="theme-title">{id}</h3>
				<hr className="bold-separator"/>
				<form className="edit-theme-form" id={`edit-custom-theme-form`} onSubmit={handleSubmit(handler)}>
					<FormStyleContext.Provider value={{ labelSize: "large" }}>
						{Object.keys(editingTheme.palette).map(x => 
							<FormField<IEditThemeForm>
								key={x}
								name={x}
								label={toTitleCase(x.replace(/\-/g, " "))}
								fieldSize="max"
								register={register}
								submitEvent={submit.current}
								selector={(data: IEditThemeForm) => data[x]}
								inputType={InputMethodType.Colour}
								// @ts-ignore
								defaultValue={editingTheme.palette[x]}
								/>
						)}
					</FormStyleContext.Provider>
				</form>
				<input className="button-small" type="submit" value="Save Changes" form="edit-custom-theme-form"/>
			</>}
		</div>
	);
}
