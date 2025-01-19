import { useEffect, useMemo, useState } from "react";
import { VideoDirectory, VideoDirectoryPresentationContext } from "../VideoDirectory/VideoDirectory"
import { InteractableBrowserNode } from "../VideoDirectory/nodes/InteractableBrowserNode";
import { useVideoStateAccess } from "../../../features/useVideoStateAccess";
import { directoryPathConcat, getItemFromNode, getNodePathIdentifier, getRootDirectoryPathFromSubDirectory, IDirectoryNode, IVideoBrowserNode, reformatDirectoryPath, VideoDirectoryInteractionContext } from "../directory";
import { useNotificationMessage } from "../../../features/useNotificationMessage";
import { IconContainer } from "../../../images/svgAsset";
import { ReactComponent as ArrowIcon } from "./../../../../../assets/symbols/arrow_sideways.svg"
import "./VideoDirectoryBrowser.css"
import { DragList } from "../../../../lib/dragList/DragList";
import { IVideo } from "../../../../lib/video/video";
import "./../VideoDirectory/VideoDirectory.css"
import { DragListItem } from "../../../../lib/dragList/DragListItem";

export type VideoPresentationStyle = "MINIMAL" | "COMPACT" | "REGULAR";

export interface IVideoDirectoryBrowserProperties {
	videoStyle: VideoPresentationStyle;
	directoryPath: string;
	onDirectoryPathChanged: (newPath: string) => void; 
}

export function VideoDirectoryBrowser({ videoStyle, directoryPath, onDirectoryPathChanged }: IVideoDirectoryBrowserProperties): React.ReactNode {
	const { videoData, root } = useVideoStateAccess();
	const [ lastKnownValidPath, setLastKnownValidPath ] = useState<string>("$");
	const [ isEditingPathManually, setIsEditingPathManually ] = useState<boolean>(false);
	const [ navigationStack, setNavigationStack ] = useState<string[]>([]);
	const { activateMessage } = useNotificationMessage();
	const directory = useMemo<IDirectoryNode | null>(() => {
		if (root == null) {
			return null;
		}

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
	}, [directoryPath, root, videoData]);

	useEffect(() => {
		if (directory == null) {
			onDirectoryPathChanged(lastKnownValidPath);
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
						onDirectoryPathChanged(getRootDirectoryPathFromSubDirectory(directory!.parent!))
						setNavigationStack([ ...navigationStack, directory!.slice ]);
					}} disabled={directory?.parent == null}>←</button>
					<button className="button-base button-small square-button" onClick={() => {
						onDirectoryPathChanged("$");
						setNavigationStack([]);
					}}>🏠︎</button>
					<button className="button-base button-small square-button" onClick={() => {
						let stackRemovedSlice = [ ...navigationStack ];
						let slice: string = stackRemovedSlice.splice(stackRemovedSlice.length - 1, 1)[0];

						onDirectoryPathChanged(directoryPathConcat(directoryPath, slice));
						setNavigationStack(stackRemovedSlice);
					}} disabled={navigationStack.length == 0}>→</button>
				</div>
				{
					isEditingPathManually ?
						<input
							className="directory-path-bar small-text-input"
							onBlur={(e) => {
								onDirectoryPathChanged(reformatDirectoryPath(e.target.value));
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
												onDirectoryPathChanged(directPath);
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
						onDirectoryPathChanged(getRootDirectoryPathFromSubDirectory(requester));
						setNavigationStack([]);
					}
				}}>
				<VideoDirectoryPresentationContext.Provider
					value={{
						videoItemStyle: videoStyle
					}}>
					<DragList className="video-directory-list separated-scrollbox" dragListName="directory-dl">
						{directory != null ? <VideoDirectory directoryData={directory}/> : <p>No directory</p>}
					</DragList>
				</VideoDirectoryPresentationContext.Provider>
			</VideoDirectoryInteractionContext.Provider>
		</>
	)
}
