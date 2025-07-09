import { directoryPathConcat, getParentPathFromPath, NodePath, parsePath, pathToString } from "../../../../lib/directory/path";
import { IconContainer } from "../../../images/svgAsset";
import { useDirectory } from "../useDirectory";
import ArrowIcon from "./../../../../../assets/symbols/arrows/arrowhead_sideways.svg?react"
import SettingsIcon from "./../../../../../assets/icons/settings_icon.svg?react";
import MinimalViewIcon from "./../../../../../assets/icons/view/minimal_option.svg?react"
import CompactViewIcon from "./../../../../../assets/icons/view/compact_option.svg?react"
import RegularViewIcon from "./../../../../../assets/icons/view/regular_option.svg?react"
import HomeIcon from "./../../../../../assets/icons/home.svg?react"
import LongArrow from "./../../../../../assets/symbols/arrows/long_arrow.svg?react"
import ButtonsIcon from "./../../../../../assets/icons/buttons.svg?react"
import TextIcon from "./../../../../../assets/icons/text.svg?react"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tempStateActions } from "../../../../features/state/tempStateSlice";
import { RootState } from "../../../../app/store";
import { ToggleExpander } from "../../../presentation/ToggleExpander/ToggleExpander";
import { LabelGroup } from "../../../presentation/Decorative/LabelGroup/LabelGroup";
import styles from "./VideoDirectoryControls.module.css";
import { ButtonPanel } from "../../../interactive/ButtonPanel/ButtonPanel";
import { SmallButton } from "../../../interactive/buttons/SmallButton/SmallButton";
import { getNodeFromPath } from "../../../../lib/directory/directory";

export interface IVideoDirectoryControlsProperties {
	path: NodePath;
	onDirectoryPathChanged: (path: NodePath) => void;
	navigationStack: string[];
	onNavigate: (stack: string[]) => void;
	setDirectoryBarHoverPath: (path: NodePath | null) => void;
}

export function VideoDirectoryControls({
		path,
		onDirectoryPathChanged,
		navigationStack,
		onNavigate,
		setDirectoryBarHoverPath
	}: IVideoDirectoryControlsProperties) {
	const directory = useDirectory(path);
	const layout = useSelector((state: RootState) => state.tempState.layout);
	const tree = useSelector((state: RootState) => state.directory.videoBrowser);
	const dispatch = useDispatch();
	const [ isEditingPathManually, setIsEditingPathManually ] = useState<boolean>(false);
	
	const processTypedPath = (value: string) => {
		let path = parsePath(value);
		let node = getNodeFromPath(tree, path);

		if (node != null) {
			onDirectoryPathChanged(path);
			onNavigate([]);
			setIsEditingPathManually(false);

			return true;
		}

		return false;
	}

	let parentSlices = getParentPathFromPath(path).slices;

	let accumulator = "";
	
	return (
		<>
			<div className={styles.directoryNavigator}>
				<ButtonPanel className={styles.navigationButtons}>
					<SmallButton
						square
						disabled={path.slices[path.slices.length - 1] == "$"}	
						title="Go back."
						onClick={() => {
							onDirectoryPathChanged(getParentPathFromPath(path));
							onNavigate([ ...navigationStack, directory!.slice ]);
						}}>
							<IconContainer className={styles.backArrow + " icon-colour-standard"} asset={LongArrow} use-stroke/>
					</SmallButton>
					<SmallButton
						square
						title="Go to root directory." onClick={() => {
							onDirectoryPathChanged(parsePath("$"));
							onNavigate([]);
						}}>
							<IconContainer className="icon-colour-standard" asset={HomeIcon} use-stroke use-fill/>
					</SmallButton>
					<SmallButton
						square
						disabled={navigationStack.length == 0}
						title="Go forward."
						onClick={() => {
							let stackRemovedSlice = [ ...navigationStack ];
							let slice: string = stackRemovedSlice.splice(stackRemovedSlice.length - 1, 1)[0];

							onDirectoryPathChanged(directoryPathConcat(path, slice, "DIRECTORY"));
							onNavigate(stackRemovedSlice);
						}}>
							<IconContainer className="icon-colour-standard" asset={LongArrow} use-stroke/>
					</SmallButton>
				</ButtonPanel>
				{
					isEditingPathManually ?
						<input
							className={styles.pathBar + " small-text-input"}
							onBlur={(e) => {
								let result = processTypedPath(e.currentTarget.value);

								if (!result) {
									setIsEditingPathManually(false);
								}
							}}
							onKeyDown={(e) => {
								if (e.key == "Enter") {
									processTypedPath(e.currentTarget.value);
								}
							}}
							autoFocus
							defaultValue={pathToString(path)}/>
						:
						<ul className={styles.pathBar + " small-text-input " + styles.navigatorSlices} onClick={() => setIsEditingPathManually(true)}>
							{
								parentSlices.map(x => {
									accumulator += x;
									let directPath = accumulator;
									
									accumulator += " > ";
									
									return (
										<li key={directPath}>
											<button className={styles.jumpToSlicePathButton} onClick={(e) => {
												onDirectoryPathChanged(parsePath(directPath));
												onNavigate([]);
												e.stopPropagation();
											}}
											onMouseEnter={() => setDirectoryBarHoverPath(parsePath(directPath))}
											onMouseLeave={() => setDirectoryBarHoverPath(null)}>{x}</button>
												<IconContainer className="icon-colour-standard" asset={ArrowIcon} use-fill/>
										</li>
									);
								})
							}
							<li>{path.slices[path.slices.length - 1]}</li>
						</ul>
				}
				<SmallButton
					square
					className={styles.settingsButton}
					onClick={() => dispatch(tempStateActions.setLayoutState({ ...layout, isDirectoryBrowserSettingsExpanded: !layout.isDirectoryBrowserSettingsExpanded }))}>
						<IconContainer className="icon-colour-standard" asset={SettingsIcon} use-stroke use-fill/>
				</SmallButton>
			</div>
			<ToggleExpander expanded={layout.isDirectoryBrowserSettingsExpanded}>
				<div className={styles.settingsPanel}>
					<LabelGroup label="Video Card">
						<ButtonPanel className={styles.viewSection}>
							<SmallButton square
								title="Minimal video card style, shows only title."
								onClick={() => dispatch(tempStateActions.changeVideoViewStyle("MINIMAL"))}
								data-active-toggle={layout.videoItemViewStyle == "MINIMAL"}>
									<IconContainer className="icon-colour-standard" asset={MinimalViewIcon} use-stroke use-fill data-active-toggle={layout.videoItemViewStyle == "MINIMAL"}/>
							</SmallButton>
							<SmallButton square
								title="Compact video card style, shows title and small thumbnail."
								onClick={() => dispatch(tempStateActions.changeVideoViewStyle("COMPACT"))}
								data-active-toggle={layout.videoItemViewStyle == "COMPACT"}>
									<IconContainer className="icon-colour-standard" asset={CompactViewIcon} use-stroke use-fill data-active-toggle={layout.videoItemViewStyle == "COMPACT"}/>
							</SmallButton>
							<SmallButton
								title="Regular video card style, shows title, thumbnail and channel."
								square
								onClick={() => dispatch(tempStateActions.changeVideoViewStyle("REGULAR"))} data-active-toggle={layout.videoItemViewStyle == "REGULAR"}>
									<IconContainer className="icon-colour-standard" asset={RegularViewIcon} use-stroke use-fill data-active-toggle={layout.videoItemViewStyle == "REGULAR"}/>
							</SmallButton>
						</ButtonPanel>
					</LabelGroup>
					<LabelGroup label="Timestamp">
						<ButtonPanel>
							<SmallButton className={styles.timestampStyleButton} onClick={() => dispatch(tempStateActions.changeTimestampStyle("FULL"))} title="Show the full controls and a smaller amount of message text per timestamp." data-active-toggle={layout.timestampStyle == "FULL"}>
								<IconContainer
									className="icon-colour-standard"
									asset={ButtonsIcon}
									use-stroke
									use-fill
									data-active-toggle={layout.timestampStyle == "FULL"}/>
							</SmallButton>
							<SmallButton className={styles.timestampStyleButton} onClick={() => dispatch(tempStateActions.changeTimestampStyle("TEXT"))} title="Only show the timestamp message per timestamp. Allows no editing but provides the most room to read." data-active-toggle={layout.timestampStyle == "TEXT"}>
								<IconContainer
									className="icon-colour-standard"
									asset={TextIcon}
									use-stroke
									use-fill
									data-active-toggle={layout.timestampStyle == "TEXT"}/>
							</SmallButton>
						</ButtonPanel>
					</LabelGroup>
				</div>
			</ToggleExpander>
		</>
	)
}
