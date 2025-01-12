import { useEffect, useMemo, useState } from "react";
import { VideoDirectory } from "../VideoDirectory/VideoDirectory"
import "./VideoDirectoryBrowser.css"
import { useVideoAccess } from "../../../features/useVideoAccess";
import { getItemFromNode, getRootDirectoryPathFromSubDirectory, IDirectoryNode, VideoDirectoryInteractionContext } from "../directory";
import { useNotificationMessage } from "../../../features/useNotificationMessage";

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

	return (
		<>
			<span>Current Directory: <i>{directoryPath}</i></span>
			<VideoDirectoryInteractionContext.Provider
				value={{
					navigateRequest: (requester) => setDirectoryPath(getRootDirectoryPathFromSubDirectory(requester))
				}}>
				{directory != null ? <VideoDirectory directoryData={directory}/> : <p>No directory</p>}
			</VideoDirectoryInteractionContext.Provider>
		</>
	)
}
