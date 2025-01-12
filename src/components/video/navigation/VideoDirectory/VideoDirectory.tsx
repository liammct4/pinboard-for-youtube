import { createContext, useContext } from "react";
import { VideoTimestamp } from "../../VideoTimestamp/VideoTimestamp";
import { getNodePathIdentifier, IDirectoryNode, IVideoBrowserNode, VideoDirectoryInteractionContext } from "../directory"
import "./VideoDirectory.css"

export interface IVideoDirectoryProperties {
	directoryData: IDirectoryNode;
}

interface IDirectoryItemProperties {
	// TODO
	node: IDirectoryNode,
}

function DirectoryItem({ node }: IDirectoryItemProperties): React.ReactNode {
	const { navigateRequest } = useContext(VideoDirectoryInteractionContext);

	return (
		<li className="video-directory-item">
			<button onClick={() => navigateRequest(node)}>Enter</button>
			<p>{node.slice}</p>
		</li>
	)
}

export function VideoDirectory({ directoryData }: IVideoDirectoryProperties): React.ReactNode {
	return (
		<ul>
			{directoryData.subNodes.map(x => <DirectoryItem node={x as IDirectoryNode} key={getNodePathIdentifier(x)}/>)}
		</ul>
	)
}
