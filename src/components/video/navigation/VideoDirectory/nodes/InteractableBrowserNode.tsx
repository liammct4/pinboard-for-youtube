import { useContext } from "react";
import { DirectoryItem } from "./DirectoryItem";
import { VideoItem } from "./VideoItem";
import { getNodeType, IDirectoryNode, INode, IVideoNode } from "../../../../../lib/directory/directory";
import { IVideoDirectoryInteractionContext, VideoDirectoryInteractionContext } from "../../../../../context/directory";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import "./InteractableBrowserNode.css"

export interface IInteractableBrowserNodeProperties {
	node: INode;
}

export function InteractableBrowserNode({ node }: IInteractableBrowserNodeProperties): React.ReactNode {
	const { selectedItems, setSelectedItems } = useContext<IVideoDirectoryInteractionContext>(VideoDirectoryInteractionContext);
	const nodeType = useSelector((state: RootState) => getNodeType(state.directory.videoBrowser, node.nodeID));

	return (
		<li
			className={`node-item ${nodeType == "DIRECTORY" ? "directory-node-item" : "video-node-item"}`}
			data-is-hover-highlight={true}
			data-is-selected={selectedItems.includes(node.nodeID)}
			onMouseDown={(e) => {
				if (e.ctrlKey) {
					if (selectedItems.includes(node.nodeID)) {
						setSelectedItems([ ...selectedItems ].filter(x => x != node.nodeID));
					}
					else {
						setSelectedItems([ ...selectedItems, node.nodeID])
					}
				}
				else if (!selectedItems.includes(node.nodeID)) {
					setSelectedItems([ node.nodeID ]);
				}
			}}>
			{nodeType == "DIRECTORY" ?
				<DirectoryItem node={node as IDirectoryNode} />
				:
				<VideoItem node={node as IVideoNode}/>}
		</li>
	);
}
