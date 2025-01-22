import { useContext } from "react";
import { getNodePathIdentifier, IDirectoryNode, IVideoBrowserNode, IVideoDirectoryInteractionContext, IVideoNode, VideoDirectoryInteractionContext } from "../../directory";
import { DirectoryItem } from "./DirectoryItem";
import { VideoItem } from "./VideoItem";
import "./InteractableBrowserNode.css"

export interface IInteractableBrowserNodeProperties {
	node: IVideoBrowserNode;
}

export function InteractableBrowserNode({ node }: IInteractableBrowserNodeProperties): React.ReactNode {
	const { selectedItems } = useContext<IVideoDirectoryInteractionContext>(VideoDirectoryInteractionContext);
	let isDirectoryNode = node.type == "DIRECTORY";
	let id = getNodePathIdentifier(node);

	return (
		<li
			className={`node-item ${isDirectoryNode ? "directory-node-item" : "video-node-item"}`}
			data-is-hover-highlight={isDirectoryNode}
			data-is-selected={selectedItems.includes(id)}>
			{isDirectoryNode ?
				<DirectoryItem node={node as IDirectoryNode} />
				:
				<VideoItem node={node as IVideoNode}/>}
		</li>
	);
}
