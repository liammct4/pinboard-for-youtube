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
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tempStateActions } from "../../../../features/state/tempStateSlice";
import { RootState } from "../../../../app/store";
import { ToggleExpander } from "../../../presentation/ToggleExpander/ToggleExpander";
import { LabelGroup } from "../../../presentation/Decorative/LabelGroup/LabelGroup";
import "./VideoDirectoryControls.css"
import { ButtonPanel } from "../../../interactive/ButtonPanel/ButtonPanel";
import { SmallButton } from "../../../interactive/buttons/SmallButton/SmallButton";

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
	const dispatch = useDispatch();
	const [ isEditingPathManually, setIsEditingPathManually ] = useState<boolean>(false);
	
	let parentSlices = getParentPathFromPath(path).slices;

	let accumulator = "";
	
	return (
		<>
			<div className="directory-navigator">
				<ButtonPanel className="navigation-buttons">
					<SmallButton
						square
						disabled={path.slices[path.slices.length - 1] == "$"}	
						title="Go back."
						onClick={() => {
							onDirectoryPathChanged(getParentPathFromPath(path));
							onNavigate([ ...navigationStack, directory!.slice ]);
						}}>
							<IconContainer className="back-arrow icon-colour-standard" asset={LongArrow} use-stroke/>
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
							className="directory-path-bar small-text-input"
							onBlur={(e) => {
								onDirectoryPathChanged(parsePath(e.target.value));
								onNavigate([]);
								setIsEditingPathManually(false);
							}}
							onKeyDown={(e) => {
								if (e.key == "Enter") {
									onDirectoryPathChanged(parsePath(e.currentTarget.value));
									onNavigate([]);
									setIsEditingPathManually(false);
								}
							}}
							autoFocus
							defaultValue={pathToString(path)}/>
						:
						<ul className="directory-path-bar small-text-input directory-navigator-slices" onClick={() => setIsEditingPathManually(true)}>
							{
								parentSlices.map(x => {
									accumulator += x;
									let directPath = accumulator;
									
									accumulator += " > ";
									
									return (
										<li key={directPath}>
											<button className="jump-to-slice-path-button" onClick={(e) => {
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
					className="settings-button"
					onClick={() => dispatch(tempStateActions.setLayoutState({ ...layout, isDirectoryBrowserSettingsExpanded: !layout.isDirectoryBrowserSettingsExpanded }))}>
						<IconContainer className="icon-colour-standard" asset={SettingsIcon} use-stroke use-fill/>
				</SmallButton>
			</div>
			<ToggleExpander expanded={layout.isDirectoryBrowserSettingsExpanded}>
				<div className="settings-panel">
					<LabelGroup label="View">
						<ButtonPanel className="view-section">
							<SmallButton square onClick={() => dispatch(tempStateActions.changeVideoViewStyle("MINIMAL"))} data-active-toggle={layout.videoItemViewStyle == "MINIMAL"}>
								<IconContainer className="icon-colour-standard" asset={MinimalViewIcon} use-stroke use-fill attached-attributes={{ "data-active-toggle": layout.videoItemViewStyle == "MINIMAL" }}/>
							</SmallButton>
							<SmallButton square onClick={() => dispatch(tempStateActions.changeVideoViewStyle("COMPACT"))} data-active-toggle={layout.videoItemViewStyle == "COMPACT"}>
								<IconContainer className="icon-colour-standard" asset={CompactViewIcon} use-stroke use-fill attached-attributes={{ "data-active-toggle": layout.videoItemViewStyle == "COMPACT" }}/>
							</SmallButton>
							<SmallButton square onClick={() => dispatch(tempStateActions.changeVideoViewStyle("REGULAR"))} data-active-toggle={layout.videoItemViewStyle == "REGULAR"}>
								<IconContainer className="icon-colour-standard" asset={RegularViewIcon} use-stroke use-fill attached-attributes={{ "data-active-toggle": layout.videoItemViewStyle == "REGULAR" }}/>
							</SmallButton>
						</ButtonPanel>
					</LabelGroup>
				</div>
			</ToggleExpander>
		</>
	)
}
