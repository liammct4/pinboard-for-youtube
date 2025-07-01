import { useContext, useMemo } from "react"
import { useNavigate } from "react-router-dom";
import { RootState, store } from "../../../../../app/store";
import { IAppTheme, ColourPalette, ThemeID, createTheme, ICustomTheme } from "../../../../../lib/config/theming/appTheme";
import { Reorder } from "framer-motion";
import { FormDialog } from "../../../../../components/dialogs/FormDialog";
import { SplitHeading } from "../../../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import DeleteIcon from "./../../../../../../assets/icons/bin.svg?react"
import { IconContainer } from "../../../../../components/images/svgAsset";
import { ActionMessageDialog } from "../../../../../components/dialogs/ActionDialogMessage";
import "./AppearancePresets.css"
import { TextInput } from "../../../../../components/input/TextInput/TextInput";
import { DropdownInput } from "../../../../../components/input/DropdownInput/DropdownInput";
import { SmallButton } from "../../../../../components/interactive/buttons/SmallButton/SmallButton";
import { ButtonPanel } from "../../../../../components/interactive/ButtonPanel/ButtonPanel";
import { AppThemes, AppThemesArray, DEFAULT_THEME } from "../../../../../styling/themes";
import { useDispatch, useSelector } from "react-redux";
import { themeActions } from "../../../../../features/theme/themeSlice";
import { useNotificationMessage } from "../../../../../components/features/notifications/useNotificationMessage";
import { useTheme } from "../../../../../components/features/useTheme";

interface IThemePresetProperties {
	theme: ThemeID;
}

function ThemePreset({ theme }: IThemePresetProperties): React.ReactNode {
	const dispatch = useDispatch();
	const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
	const customThemes = useSelector((state: RootState) => state.theme.customThemes);
	const themeData = AppThemes[theme] ?? customThemes.find(x => x.id == theme);
	const navigate = useNavigate();
	
	return (
		<Reorder.Item value={theme}>
			<div className="theme-row">
				<button
					className="select-button"
					onClick={() => dispatch(themeActions.setCurrentTheme(theme))}
					data-selected={currentTheme == theme ? "" : null}>
					<h3 className="name">{themeData.name}</h3>
					<div className="preview-grid">
						<div style={{ background: themeData.palette["primary-common"] }}/>
						<div style={{ background: themeData.palette["primary-ultradark"] }}/>
						<div style={{ background: themeData.palette["empty-02-raised"] }}/>
						<div style={{ background: themeData.palette["empty-01-normal"] }}/>
					</div>
				</button>
				{AppThemes[theme] == undefined ?
					<ButtonPanel className="modify-buttons">
						<SmallButton square onClick={() => dispatch(themeActions.deleteCustomTheme(theme))}>
							<IconContainer
								className="icon-colour-standard"
								asset={DeleteIcon}
								use-stroke
								use-fill/>
						</SmallButton>
						<SmallButton onClick={() => navigate(`custom/${themeData.name}`)}>Edit</SmallButton>
					</ButtonPanel>
					: <></>
				}
			</div>
		</Reorder.Item>
	);
}

type AddCustomThemeFormField = "customName" | "basedOn";
type AddCustomThemeForm = {
	customName: string;
	basedOn: ThemeID;
}

export function AppearancePresets(): React.ReactNode {
	const customThemes = useSelector((state: RootState) => state.theme.customThemes);
	const { allThemes } = useTheme();
	const dispatch = useDispatch();
	const { activateMessage } = useNotificationMessage();

	const onSubmitCustom = (form: AddCustomThemeForm) => {
		let palette: ColourPalette | undefined = allThemes
			.find(t => t.id == form.basedOn)?.palette;
		
		if (palette == undefined) {
			activateMessage("An unknown error has occurred.", "Could not create the theme.", "Error", "Error", 6000, "Shake");
			return;
		}

		let newTheme: ICustomTheme = {
			id: createTheme(),
			name: form.customName,
			palette: { ...palette },
			basedOn: form.basedOn
		};
		
		dispatch(themeActions.addCustomTheme(newTheme));
	}
	const onReorder = (newCustomThemes: ICustomTheme[]) => {
		dispatch(themeActions.setCustomThemes(newCustomThemes));
	};

	return (
		<>
			<Reorder.Group className="theme-list" values={AppThemesArray} onReorder={() => null}>
				{AppThemesArray.map(t => <li key={t.id}><ThemePreset theme={t.id}/></li>)}
			</Reorder.Group>
			<hr className="bold-separator"/>
			<SplitHeading text="Custom Themes"/>
			<div className="custom-theme-controls">
				<FormDialog<AddCustomThemeForm, AddCustomThemeFormField>
					name="add-custom-theme-form"
					title="Add Custom Theme"
					description={<>Choose a name for your custom theme. This <b>Cannot</b> already exist or be a default theme.</>}
					trigger={<SmallButton>New theme</SmallButton>}
					labelSize="medium"
					submitText="Add"
					fieldData={[
						{
							name: "customName",
							validator: (data: string) => {
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
						<DropdownInput<AddCustomThemeFormField, ThemeID>
							label="Based on"
							name="basedOn"
							startValue={DEFAULT_THEME}
							fieldSize="small"
							options={[
								...AppThemesArray.map(x => { return { id: x.id, label: x.name }}),
								...customThemes.map(x => { return { id: x.id, label: x.name }})
							]}/>
				</FormDialog>
				<ActionMessageDialog
					body="Are you sure you want to clear all custom themes? This cannot be undone."
					buttons={["Yes", "Cancel"]}
					defaultFocusedButton="Cancel"
					onButtonPressed={(action: string) => {
						if (action == "Yes") {
							dispatch(themeActions.setCustomThemes([]));
						}
					}}
					title="Clear Custom Themes"
					defaultMessage="Cancel">
					<SmallButton>Clear All</SmallButton>
				</ActionMessageDialog>
			</div>
			<hr className="regular-separator"/>
			{customThemes.length != 0 ?
				<Reorder.Group layoutScroll className="theme-list" values={customThemes} onReorder={onReorder}>
					{customThemes.map(t => <ThemePreset key={t.id} theme={t.id}/>)}
				</Reorder.Group>
				: <span className="empty-theme-list-text">Nothing to display...</span>
			}
		</>
	);
}
