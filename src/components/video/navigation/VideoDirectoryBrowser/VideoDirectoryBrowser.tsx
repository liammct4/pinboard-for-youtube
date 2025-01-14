import { useEffect, useMemo, useState } from "react";
import { VideoDirectory, VideoDirectoryPresentationContext } from "../VideoDirectory/VideoDirectory"
import { useVideoAccess } from "../../../features/useVideoAccess";
import { directoryPathConcat, getItemFromNode, getRootDirectoryPathFromSubDirectory, IDirectoryNode, reformatDirectoryPath, VideoDirectoryInteractionContext } from "../directory";
import { useNotificationMessage } from "../../../features/useNotificationMessage";
import { IconContainer } from "../../../images/svgAsset";
import { ReactComponent as ArrowIcon } from "./../../../../../assets/symbols/arrow_sideways.svg"
import "./VideoDirectoryBrowser.css"

export type VideoPresentationStyle = "MINIMAL" | "COMPACT" | "REGULAR";

export interface IVideoDirectoryBrowserProperties {
	videoStyle: VideoPresentationStyle;
}

export function VideoDirectoryBrowser({ videoStyle }: IVideoDirectoryBrowserProperties): React.ReactNode {
	const { videoData, root } = useVideoAccess();
	const [ directoryPath, setDirectoryPath ] = useState<string>("$");
	const [ lastKnownValidPath, setLastKnownValidPath ] = useState<string>("$");
	const [ isEditingPathManually, setIsEditingPathManually ] = useState<boolean>(false);
	const [ navigationStack, setNavigationStack ] = useState<string[]>([]);
	const { activateMessage } = useNotificationMessage();
	const directory = useMemo<IDirectoryNode | null>(() => {
		let node = getItemFromNode(directoryPath, root);

		if (node == null) {
			activateMessage(
				"Node navigation error",
				`Path was not valid, reset to last valid directory ${lastKnownValidPath}. Invalid directory was ${directoryPath}`,
				"Error",
				"Error",
				7000
			);

			return null;
		}

		if (node.type == "VIDEO") {
			activateMessage(
				"Node navigation error",
				`Path was not valid, path was a video, reset to last valid directory ${lastKnownValidPath}. Invalid directory was ${directoryPath}`,
				"Error",
				"Error",
				7000
			);

			return null;
		}

		return node as IDirectoryNode;
	}, [directoryPath]);

	useEffect(() => {
		if (directory == null) {
			setDirectoryPath(lastKnownValidPath);
		}
		else {
			setLastKnownValidPath(directoryPath);
		}
	}, [directory]);

	const slices = directoryPath.split(">");
	const last = slices[slices.length - 1].trim();

	slices.splice(slices.length - 1, 1);
	let accumulator = "";

	return (
		<>
			<div className="directory-navigator">
				<div className="navigation-buttons">
					<button className="button-base button-small square-button" onClick={() => {
						setDirectoryPath(getRootDirectoryPathFromSubDirectory(directory!.parent!))
						setNavigationStack([ ...navigationStack, directory!.slice ]);
					}} disabled={directory?.parent == null}>←</button>
					<button className="button-base button-small square-button" onClick={() => {
						setDirectoryPath("$");
						setNavigationStack([]);
					}}>🏠︎</button>
					<button className="button-base button-small square-button" onClick={() => {
						let stackRemovedSlice = [ ...navigationStack ];
						let slice: string = stackRemovedSlice.splice(stackRemovedSlice.length - 1, 1)[0];

						setDirectoryPath(directoryPathConcat(directoryPath, slice));
						setNavigationStack(stackRemovedSlice);
					}} disabled={navigationStack.length == 0}>→</button>
				</div>
				{
					isEditingPathManually ?
						<input
							className="directory-path-bar small-text-input"
							onBlur={(e) => {
								setDirectoryPath(reformatDirectoryPath(e.target.value));
								setNavigationStack([]);
								setIsEditingPathManually(false);
							}}
							autoFocus
							defaultValue={directoryPath}/>
						:
						<ul className="directory-path-bar small-text-input directory-navigator-slices" onClick={() => setIsEditingPathManually(true)}>
							{
								slices.map(x => {
									accumulator += x;
									let directPath = accumulator;
									
									accumulator += " > ";
									
									return (
										<li key={directPath}>
											<button className="jump-to-slice-path-button" onClick={(e) => {
												setDirectoryPath(directPath);
												setNavigationStack([]);
												e.stopPropagation();
											}}>{x}</button>
											<IconContainer className="icon-colour-standard" asset={ArrowIcon} use-fill/>
										</li>
									);
								})
							}
							<li>{last}</li>
						</ul>
				}
			</div>
			<VideoDirectoryInteractionContext.Provider
				value={{
					navigateRequest: (requester) => {
						setDirectoryPath(getRootDirectoryPathFromSubDirectory(requester));
						setNavigationStack([]);
					}
				}}>
				<VideoDirectoryPresentationContext.Provider
					value={{
						videoItemStyle: videoStyle
					}}>
					<div className="separated-scrollbox">
						{directory != null ? <VideoDirectory directoryData={directory}/> : <p>No directory</p>}
					</div>
				</VideoDirectoryPresentationContext.Provider>
			</VideoDirectoryInteractionContext.Provider>
		</>
	)
}
