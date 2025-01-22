import { useContext, useState } from "react";
import { ReactComponent as CategoryIcon } from "./../../../../../../assets/icons/category.svg"
import { IDirectoryNode, VideoDirectoryInteractionContext } from "../../directory";
import { IconContainer } from "../../../../images/svgAsset";
import { Keys, useHotkeys } from "react-hotkeys-hook";

interface IDirectoryItemProperties {
	node: IDirectoryNode;
}

export function DirectoryItem({ node }: IDirectoryItemProperties): React.ReactNode {
	const { navigateRequest, selectedItems, setSelectedItems, currentlyEditing, requestEditEnd } = useContext(VideoDirectoryInteractionContext);

	return (
		<>
			<div onClick={(e) => {
				if (e.ctrlKey) {
					if (selectedItems.includes(node.slice)) {
						setSelectedItems([ ...selectedItems ].filter(x => x != node.slice));
					}
					else {
						setSelectedItems([ ...selectedItems, node.slice])
					}
				}
				else if (!selectedItems.includes(node.slice)) {
					setSelectedItems([ node.slice ]);
				}
			}}>
				<button className="enter-navigate-button" onDoubleClick={() => navigateRequest(node)}>
					<IconContainer className="icon-colour-standard" asset={CategoryIcon} use-stroke use-fill/>
					{
						currentlyEditing == node.slice ?
						<input
							className="medium-text-input"
							onBlur={(e) => requestEditEnd(e.target.value)}
							onKeyDown={(e) => {
								if (e.key == "Enter") {
									requestEditEnd(e.currentTarget.value);
								}
							}}
							defaultValue={node.slice}
							autoFocus/> :
						<span>{node.slice}</span>
					}
				</button>
			</div>
		</>
	)
}
