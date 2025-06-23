import { useContext } from "react"
import { useNavigate } from "react-router-dom";
import { store } from "../../../../../app/store";
import { ThemeContext } from "../../../../../context/theme";
import { IAppTheme, ColourPalette } from "../../../../../lib/config/theming/appTheme";
import { Reorder } from "framer-motion";
import { FormDialog } from "../../../../../components/dialogs/FormDialog";
import { SplitHeading } from "../../../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import DeleteIcon from "./../../../../../../assets/icons/bin.svg?react"
import { IconContainer } from "../../../../../components/images/svgAsset";
import { ActionMessageDialog } from "../../../../../components/dialogs/ActionDialogMessage";
import "./AppearancePresets.css"
import { TextInput } from "../../../../../components/input/TextInput/TextInput";
import { DropdownInput } from "../../../../../components/input/DropdownInput/DropdownInput";

interface IThemePresetProperties {
	theme: IAppTheme;
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
					data-selected={currentTheme.id == theme.id ? "" : null}>
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
					<button className="square-button button-base button-small" onClick={() => deleteCustomTheme(theme.id)}>
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

type AddCustomThemeFormField = "customName" | "basedOn";
type AddCustomThemeForm = {
	customName: string;
	basedOn: string;
}

export function AppearancePresets(): React.ReactNode {
	const { themes, customThemes, actions: { addCustomTheme, setCustomThemes } } = useContext(ThemeContext);
	const onSubmitCustom = (form: AddCustomThemeForm) => {
		let allThemes = [ ...store.getState().theme.themePresets, ...store.getState().theme.customThemes ];
		let palette: ColourPalette = allThemes
			.find(x => x.name == form.basedOn)?.palette
			?? themes[0].palette;

		let newTheme: IAppTheme = {
			id: crypto.randomUUID(),
			name: form.customName,
			palette: palette,
			modifiable: true
		};
		
		addCustomTheme(newTheme);
	}
	const onReorder = (newCustomThemes: IAppTheme[]) => {
		setCustomThemes(newCustomThemes);
	};

	return (
		<>
			<Reorder.Group className="theme-list" values={themes} onReorder={() => null}>
				{themes.map(x => <li key={x.id}><ThemePreset theme={x}/></li>)}
			</Reorder.Group>
			<hr className="bold-separator"/>
			<SplitHeading text="Custom Themes"/>
			<div className="custom-theme-controls">
				<FormDialog<AddCustomThemeForm, AddCustomThemeFormField>
					name="add-custom-theme-form"
					title="Add Custom Theme"
					description={<>Choose a name for your custom theme. This <b>Cannot</b> already exist or be a default theme.</>}
					trigger={<button className="button-base button-small">New theme</button>}
					labelSize="medium"
					submitText="Add"
					fieldData={[
						{
							name: "customName",
							validator: (data: string) => {
								let allThemes = [
									...store.getState().theme.themePresets,
									...store.getState().theme.customThemes	
								];

								if (allThemes.findIndex(x => x.name == data) != -1) {
									return {
										error: true,
										details: {
											name: "customName",
											message: "A theme already exists with that name."
										}
									}
								}


								return { error: false };
							}
						}
					]}
					onSuccess={onSubmitCustom}>
						<TextInput<AddCustomThemeFormField>
							label="Theme name"
							name="customName"
							fieldSize="medium"
							startValue="My Theme"/>
						<DropdownInput<AddCustomThemeFormField>
							label="Based on"
							name="basedOn"
							startValue="None"
							fieldSize="small"
							options={[
								"None",
								...themes.map(x => x.name),
								...customThemes.map(x => x.name)
							]}/>
				</FormDialog>
				<ActionMessageDialog
					body="Are you sure you want to clear all custom themes? This cannot be undone."
					buttons={["Yes", "Cancel"]}
					defaultFocusedButton="Cancel"
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
				{customThemes.map(x => <ThemePreset key={x.id} theme={x}/>)}
			</Reorder.Group>
			: <span className="empty-theme-list-text">Nothing to display...</span>}
		</>
	);
}
