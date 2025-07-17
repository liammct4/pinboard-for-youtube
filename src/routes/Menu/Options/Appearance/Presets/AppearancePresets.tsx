import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../../app/store";
import { ColourPalette, ThemeID, createTheme, ICustomTheme } from "../../../../../lib/config/theming/appTheme";
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
import { DragListEvent, DragList } from "../../../../../components/interactive/dragList/DragList/DragList";
import { DragListItem } from "../../../../../components/interactive/dragList/DragList/DragListItem";

interface IThemePresetProperties {
	theme: ThemeID;
	useHover?: boolean;
}

function ThemePreset({ theme, useHover = true }: IThemePresetProperties): React.ReactNode {
	const dispatch = useDispatch();
	const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
	const customThemes = useSelector((state: RootState) => state.theme.customThemes);
	const themeData = AppThemes[theme] ?? customThemes.find(x => x.id == theme);
	const navigate = useNavigate();
	
	return (
		<li className="theme-row" value={theme}>
			<button
				className="select-button"
				onClick={() => dispatch(themeActions.setCurrentTheme(theme))}
				data-selected={currentTheme == theme ? "" : null}
				data-use-hover={useHover}>
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
		</li>
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
	const [ dragging, setDragging ] = useState<DragListEvent<ThemeID> | null>(null);
	const [ startDragID, setStartDragID ] = useState<ThemeID | null>(null);

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
	const onReorder = (e: DragListEvent<ThemeID>) => {
		setDragging(null);
		setStartDragID(null);

		if (e.notInBounds) {
			return;
		}

		// Means that it's been dragged to the exact same position, so no need to do anything.
		if (e.inbetweenEndID == e.startDragID) {
			return;
		}

		let newThemes = [ ...customThemes ];
		let index = newThemes.findIndex(x => x.id == e.startDragID);
		
		let theme = newThemes.splice(index, 1);
		let whereIndex = newThemes.findIndex(x => x.id == e.inbetweenEndID);

		if (e.inbetweenEndID == null) {
			newThemes.push(theme[0]);
		}
		else {
			newThemes.splice(whereIndex, 0, theme[0]);
		}

		dispatch(themeActions.setCustomThemes(newThemes));
	};

	return (
		<>
			<ButtonPanel direction="Vertical" className="theme-list">
				{AppThemesArray.map(t => <ThemePreset key={t.id} theme={t.id}/>)}
			</ButtonPanel>
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
										success: false,
										reason: {
											name: "customName",
											message: "A theme already exists with that name."
										}
									}
								}

								return { success: true };
							}
						}
					]}
					onSuccess={onSubmitCustom}>
						<TextInput<AddCustomThemeFormField>
							label="Theme name"
							name="customName"
							title="The name of the theme, must be unique."
							fieldSize="medium"
							startValue="My Theme"/>
						<DropdownInput<AddCustomThemeFormField, ThemeID>
							label="Based on"
							name="basedOn"
							title="Used as a starting point for your custom theme, copies the palette of that theme and allows you to modify it."
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
				<DragList<ThemeID>
					dragListName="theme-list"
					onDragChanged={(e) => setDragging(e)}
					onDragStart={(e) => setStartDragID(e)}
					onDragEnd={onReorder}
					className="theme-list">
						{customThemes.map(t =>
							<>
								<DragListItem className={startDragID == t.id ? "drag-theme-hover-item" : ""} key={t.id} id={t.id}>
									{
										!dragging?.notInBounds && t.id == customThemes[0].id && dragging?.inbetweenEndID == t.id ?
											<div className="drag-line"><hr data-start="true"/></div> : <></>
									}
									<ThemePreset theme={t.id} useHover={dragging == null}/>
									{
										!dragging?.notInBounds && dragging?.inbetweenStartID == t.id ?
											<div className="drag-line"><hr data-start="false"/></div> : <></>
									}
								</DragListItem>
							</>
						)}
				</DragList>
				: <span className="empty-theme-list-text">Nothing to display...</span>
			}
		</>
	);
}
