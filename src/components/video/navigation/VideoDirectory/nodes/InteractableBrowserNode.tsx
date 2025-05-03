import { useContext } from "react";
import { getSectionPrefix, IDirectoryNode, IVideoDirectoryInteractionContext, IVideoNode, VideoBrowserNode, VideoDirectoryInteractionContext } from "../../../../../lib/directory/directory";
import { DirectoryItem } from "./DirectoryItem";
import { VideoItem } from "./VideoItem";
import "./InteractableBrowserNode.css"

export interface IInteractableBrowserNodeProperties {
	node: VideoBrowserNode;
}

export function InteractableBrowserNode({ node }: IInteractableBrowserNodeProperties): React.ReactNode {
	const { selectedItems, setSelectedItems } = useContext<IVideoDirectoryInteractionContext>(VideoDirectoryInteractionContext);
	let isDirectoryNode = node.type == "DIRECTORY";
	let id = getSectionPrefix(node);

	return (
		<li
			className={`node-item ${isDirectoryNode ? "directory-node-item" : "video-node-item"}`}
			data-is-hover-highlight={true}
			data-is-selected={selectedItems.includes(id)}
			onMouseDown={(e) => {
				let section = getSectionPrefix(node);

				if (e.ctrlKey) {
					if (selectedItems.includes(section)) {
						setSelectedItems([ ...selectedItems ].filter(x => x != section));
					}
					else {
						setSelectedItems([ ...selectedItems, section])
					}
				}
				else if (!selectedItems.includes(section)) {
					setSelectedItems([ section ]);
				}
			}}>
			{node.type == "DIRECTORY" ?
				<DirectoryItem node={node} />
				:
				<VideoItem node={node}/>}
		</li>
	);
}
