import { IDirectoryNode, IVideoBrowserNode, IVideoNode } from "../../directory";
import { DirectoryItem } from "./DirectoryItem";
import { VideoItem } from "./VideoItem";

export interface IInteractableBrowserNodeProperties {
	node: IVideoBrowserNode;
}

export function InteractableBrowserNode({ node }: IInteractableBrowserNodeProperties): React.ReactNode {
	let isDirectoryNode = node.type == "DIRECTORY";

	return (
		<li
			className={`node-item ${isDirectoryNode ? "directory-node-item" : "video-node-item"}`}
			data-is-hover-highlight={isDirectoryNode}>
			{isDirectoryNode ?
				<DirectoryItem node={node as IDirectoryNode} />
				:
				<VideoItem node={node as IVideoNode}/>}
		</li>
	);
}
