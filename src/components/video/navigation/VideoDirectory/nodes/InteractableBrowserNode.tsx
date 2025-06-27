import { useContext, useRef } from "react";
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
	const itemRef = useRef<HTMLLIElement>(null!);
	
	if (itemRef.current != null && selectedItems.includes(node.nodeID)) {
		if (nodeType == "VIDEO") {
			// @ts-ignore
			let elem = itemRef.current.querySelector("div[data-focus]");
					
			if (!elem?.contains(document.activeElement)) {
				// @ts-ignore
				elem?.focus();
			}
		}
		else {
			itemRef.current.focus();
		}

		// @ts-ignore Doesn't exist in type definition for some reason:
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
		itemRef.current.scrollIntoViewIfNeeded(false);
	}

	return (
		<li
			className={`node-item ${nodeType == "DIRECTORY" ? "directory-node-item" : "video-node-item"}`}
			data-is-hover-highlight={true}
			data-is-selected={selectedItems.includes(node.nodeID)}
			ref={itemRef}
			onMouseDown={(e) => {				
				if (nodeType == "VIDEO") {
					// @ts-ignore
					itemRef.current.querySelector("div[data-focus]").focus();
				}
				else {
					itemRef.current.focus();
				}

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
			}}
			onFocus={() => setSelectedItems([ node.nodeID ])}>
			{nodeType == "DIRECTORY" ?
				<DirectoryItem node={node as IDirectoryNode} />
				:
				<VideoItem node={node as IVideoNode}/>}
		</li>
	);
}
