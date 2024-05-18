import { useContext } from "react"
import { useNavigate } from "react-router-dom";
import { store } from "../../../../../app/store";
import { ThemeContext } from "../../../../../context/theme";
import { DropdownOptionsContext } from "../../../../../components/input/DropdownInput/context";
import { IErrorFieldValues, useValidatedForm } from "../../../../../components/forms/validated-form";
import { AppTheme, ColourPalette } from "../../../../../lib/config/theming/appTheme";
import { InputMethodType } from "../../../../../lib/config/configurationOption";
import { Reorder } from "framer-motion";
import { FormField } from "../../../../../components/forms/FormField/FormField";
import FormDialog from "../../../../../components/dialogs/FormDialog";
import SplitHeading from "../../../../../components/presentation/SplitHeading/SplitHeading";
import { ReactComponent as DeleteIcon } from "./../../../../../../assets/icons/bin.svg"
import { IconContainer } from "../../../../../components/images/svgAsset";
import ActionMessageDialog from "../../../../../components/dialogs/ActionDialogMessage";
import "./AppearancePresets.css"

interface IThemePresetProperties {
	theme: AppTheme;
}

function ThemePreset({ theme }: IThemePresetProperties): React.ReactNode {
	const { currentTheme, actions: { setCurrentTheme, deleteCustomTheme } } = useContext(ThemeContext);
	const navigate = useNavigate();

	return (
		<Reorder.Item value={theme}>
			<div className="theme-row">
				<button
					className="select-button"
					onClick={() => setCurrentTheme(theme)}
					data-selected={currentTheme.name == theme.name ? "" : null}>
					<h3 className="name">{theme.name}</h3>
					<div className="preview-grid">
						<div style={{ background: theme.palette["primary-common"] }}/>
						<div style={{ background: theme.palette["primary-ultradark"] }}/>
						<div style={{ background: theme.palette["empty-02-raised"] }}/>
						<div style={{ background: theme.palette["empty-01-normal"] }}/>
					</div>
				</button>
				{ theme.modifiable ?
				<div className="modify-buttons">
					<button className="square-button button-base button-small" onClick={() => deleteCustomTheme(theme.name)}>
						<IconContainer
							className="icon-colour-standard"
							asset={DeleteIcon}
							use-stroke
							use-fill/>
					</button>
					<button className="button-base button-small" onClick={() => navigate(`custom/${theme.name}`)}>Edit</button>
				</div>
				: <></>}
			</div>
		</Reorder.Item>
	);
}

export interface IAddCustomThemeForm extends IErrorFieldValues {
	customName: string;
	basedOn: string;
}

export function AppearancePresets(): React.ReactNode {
	const { themes, customThemes, actions: { addCustomTheme, setCustomThemes } } = useContext(ThemeContext);
	const onSubmitCustom = (form: IAddCustomThemeForm) => {
		let allThemes = [ ...store.getState().theme.themePresets, ...store.getState().theme.customThemes ];
		let palette: ColourPalette = allThemes
			.find(x => x.name == form.basedOn)?.palette
			?? themes[0].palette;

		let newTheme: AppTheme = {
			name: form.customName,
			palette: palette,
			modifiable: true
		};
		
		addCustomTheme(newTheme);
	}
	let { register, handleSubmit, handler, submit } = useValidatedForm<IAddCustomThemeForm>(onSubmitCustom);
	const onReorder = (newCustomThemes: AppTheme[]) => {
		setCustomThemes(newCustomThemes);
	};

	return (
		<>
			<Reorder.Group className="theme-list" values={themes} onReorder={() => null}>
				{themes.map(x => <li key={x.name}><ThemePreset theme={x}/></li>)}
			</Reorder.Group>
			<hr className="bold-separator"/>
			<SplitHeading text="Custom Themes"/>
			<div className="custom-theme-controls">
				<FormDialog
					formID="add-custom-theme-form"
					formTitle="Add Custom Theme"
					description={<>Choose a name for your custom theme. This <b>Cannot</b> already exist or be a default theme.</>}
					trigger={<button className="button-base button-small">New theme</button>}
					labelSize="medium"
					submitText="Add"
					handleSubmit={handleSubmit(handler)}>
						{/* TODO: Refactor submitEvent and register into context. */}
						<FormField<IAddCustomThemeForm>
							label="Theme name"
							name="customName"
							register={register}
							selector={(value: IAddCustomThemeForm) => value.customName}
							fieldSize="medium"
							defaultValue="My Theme"
							inputType="Text"
							submitEvent={submit.current}
							validationMethod={(data: string) => {
								let allThemes = [
									...store.getState().theme.themePresets,
									...store.getState().theme.customThemes	
								];

								if (allThemes.findIndex(x => x.name == data) != -1) {
									return "A theme already exists with that name.";
								}

								return null;
							}}
							/>
						<DropdownOptionsContext.Provider value={{ options: [
							"None",
							...themes.map(x => x.name),
							...customThemes.map(x => x.name)
						]}}>
							<FormField<IAddCustomThemeForm>
								label="Based on"
								name="basedOn"
								register={register}
								selector={(value: IAddCustomThemeForm) => value.customName}
								defaultValue="None"
								fieldSize="small"
								inputType="Dropdown"
								submitEvent={submit.current}
								/>
						</DropdownOptionsContext.Provider>
				</FormDialog>
				<ActionMessageDialog
					body="Are you sure you want to clear all custom themes? This cannot be undone."
					buttons={["Yes", "Cancel"]}
					onButtonPressed={(action: string) => {
						if (action == "Yes") {
							setCustomThemes([])
						}
					}}
					title="Clear Custom Themes"
					defaultMessage="Cancel">
					<button className="button-base button-small">Clear All</button>
				</ActionMessageDialog>
			</div>
			<hr className="regular-separator"/>
			{customThemes.length != 0 ?
			<Reorder.Group layoutScroll className="theme-list" values={customThemes} onReorder={onReorder}>
				{customThemes.map(x => <ThemePreset key={x.name} theme={x}/>)}
			</Reorder.Group>
			: <span className="empty-theme-list-text">Nothing to display...</span>}
		</>
	);
}
