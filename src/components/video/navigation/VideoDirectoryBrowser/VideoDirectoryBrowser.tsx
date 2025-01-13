import { useEffect, useMemo, useState } from "react";
import { VideoDirectory } from "../VideoDirectory/VideoDirectory"
import "./VideoDirectoryBrowser.css"
import { useVideoAccess } from "../../../features/useVideoAccess";
import { getItemFromNode, getRootDirectoryPathFromSubDirectory, IDirectoryNode, reformatDirectoryPath as reformatDirectoryPath, VideoDirectoryInteractionContext } from "../directory";
import { useNotificationMessage } from "../../../features/useNotificationMessage";
import { IconContainer } from "../../../images/svgAsset";
import { ReactComponent as ArrowIcon } from "./../../../../../assets/symbols/arrow_sideways.svg"

export function VideoDirectoryBrowser(): React.ReactNode {
	const { videoData, root } = useVideoAccess();
	const [ directoryPath, setDirectoryPath ] = useState<string>("$");
	const [ lastKnownValidPath, setLastKnownValidPath ] = useState<string>("$");
	const [ isEditingPathManually, setIsEditingPathManually ] = useState<boolean>(false);
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
				<button className="button-base button-small square-button" onClick={() => setDirectoryPath(getRootDirectoryPathFromSubDirectory(directory!.parent!))}>←</button>
				{
					isEditingPathManually ?
						<input
							className="directory-path-bar small-text-input"
							onBlur={(e) => {
								setDirectoryPath(reformatDirectoryPath(e.target.value));
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
					navigateRequest: (requester) => setDirectoryPath(getRootDirectoryPathFromSubDirectory(requester))
				}}>
				<div className="separated-scrollbox">
					{directory != null ? <VideoDirectory directoryData={directory}/> : <p>No directory</p>}
				</div>
			</VideoDirectoryInteractionContext.Provider>
		</>
	)
}
