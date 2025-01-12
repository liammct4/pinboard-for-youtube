import { useEffect, useMemo, useState } from "react";
import { VideoDirectory } from "../VideoDirectory/VideoDirectory"
import "./VideoDirectoryBrowser.css"
import { useVideoAccess } from "../../../features/useVideoAccess";
import { getItemFromNode, getRootDirectoryPathFromSubDirectory, IDirectoryNode, VideoDirectoryInteractionContext } from "../directory";
import { useNotificationMessage } from "../../../features/useNotificationMessage";
import { IconContainer } from "../../../images/svgAsset";
import { ReactComponent as ArrowIcon } from "./../../../../../assets/symbols/arrow_sideways.svg"

export function VideoDirectoryBrowser(): React.ReactNode {
	const { videoData, root } = useVideoAccess();
	const [ directoryPath, setDirectoryPath ] = useState<string>("$");
	const { activateMessage } = useNotificationMessage();
	const directory = useMemo<IDirectoryNode | null>(() => {
		let node = getItemFromNode(directoryPath, root);

		if (node == null) {
			activateMessage(
				"Node navigation error",
				`Path was not valid, reset to root directory '$'. Invalid directory was ${directoryPath}`,
				"Error",
				"Error",
				7000
			);

			return null;
		}

		if (node.type == "VIDEO") {
			activateMessage(
				"Node navigation error",
				`Path was not valid, path was a video, reset to root directory '$'. Invalid directory was ${directoryPath}`,
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
			setDirectoryPath("$");
		}
	}, [directory]);

	const slices = directoryPath.split(">");
	const last = slices[slices.length - 1];

	slices.splice(slices.length - 1, 1);
	let accumulator = "";

	return (
		<>
			<div className="directory-navigator">
				<button className="button-base button-small square-button" onClick={() => setDirectoryPath(getRootDirectoryPathFromSubDirectory(directory!.parent!))}>←</button>
				<ul className="directory-navigator-slices">
					{
						slices.map(x => {
							accumulator += x;
							let directPath = accumulator;
							
							accumulator += ">";
							
							return (
								<li key={directPath}>
									<button className="button-base button-small" onClick={() => setDirectoryPath(directPath)}>{x}</button>
									<IconContainer className="icon-colour-standard" asset={ArrowIcon} use-fill/>
								</li>
							);
						})
					}
					<li>{last}</li>
				</ul>
			</div>
			<VideoDirectoryInteractionContext.Provider
				value={{
					navigateRequest: (requester) => setDirectoryPath(getRootDirectoryPathFromSubDirectory(requester))
				}}>
				{directory != null ? <VideoDirectory directoryData={directory}/> : <p>No directory</p>}
			</VideoDirectoryInteractionContext.Provider>
		</>
	)
}
