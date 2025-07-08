import { useContext, useRef } from "react";
import { DirectoryItem } from "./DirectoryItem";
import { VideoItem } from "./VideoItem";
import { getNodeType, IDirectoryNode, INode, IVideoNode } from "../../../../../lib/directory/directory";
import { IVideoDirectoryInteractionContext, VideoDirectoryInteractionContext } from "../../../../../context/directory";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import DeleteIcon from "./../../../../../../assets/icons/bin.svg?react"
import "./InteractableBrowserNode.css"
import { SmallButton } from "../../../../interactive/buttons/SmallButton/SmallButton";
import { IconContainer } from "../../../../images/svgAsset";

export interface IInteractableBrowserNodeProperties {
	node: INode;
}

export function InteractableBrowserNode({ node }: IInteractableBrowserNodeProperties): React.ReactNode {
	const { selectedItems, setSelectedItems, activateDeleteNodeDialog } = useContext<IVideoDirectoryInteractionContext>(VideoDirectoryInteractionContext);
	const nodeType = useSelector((state: RootState) => getNodeType(state.directory.videoBrowser, node.nodeID));
	const itemRef = useRef<HTMLLIElement>(null!);
	
	if (itemRef.current != null && selectedItems.includes(node.nodeID) && selectedItems.length == 1) {
		let itemElement = itemRef.current.querySelector("*[data-focus]");

		if (nodeType == "DIRECTORY" || (nodeType == "VIDEO" && !itemElement?.contains(document.activeElement))) {
			// @ts-ignore
			itemElement?.focus();
		}

		// @ts-ignore Doesn't exist in type definition for some reason:
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
		itemRef.current.scrollIntoViewIfNeeded(false);
	}

	return (
		<>
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
				onFocus={() => {
					if (selectedItems.length <= 1) {
						setSelectedItems([ node.nodeID ])}
					}
				}>
				{nodeType == "DIRECTORY" ?
					<DirectoryItem node={node as IDirectoryNode} />
					:
					<VideoItem node={node as IVideoNode}/>
				}
				<SmallButton tabIndex={-1} onClick={() => activateDeleteNodeDialog(node.nodeID)} square>
					<IconContainer className="icon-colour-standard" asset={DeleteIcon} use-stroke/>
				</SmallButton>
			</li>
		</>
	);
}
