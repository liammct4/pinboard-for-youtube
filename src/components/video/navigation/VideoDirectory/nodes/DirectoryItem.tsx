import { useContext, useState } from "react";
import { ReactComponent as CategoryIcon } from "./../../../../../../assets/icons/category.svg"
import { ReactComponent as DropIcon } from "./../../../../../../assets/icons/drop_in.svg"
import { getSectionPrefix, IDirectoryNode, VideoDirectoryInteractionContext } from "../../directory";
import { IconContainer } from "../../../../images/svgAsset";
import { Keys, useHotkeys } from "react-hotkeys-hook";

interface IDirectoryItemProperties {
	node: IDirectoryNode;
}

export function DirectoryItem({ node }: IDirectoryItemProperties): React.ReactNode {
	const {
		navigateRequest,
		currentlyEditing,
		requestEditEnd,
		draggingID
	} = useContext(VideoDirectoryInteractionContext);

	let section = getSectionPrefix(node);
	let isHover = draggingID == section;

	return (
		<>
			<div data-is-hover-overlap={isHover}>
				<button className="enter-navigate-button" onDoubleClick={() => navigateRequest(node)}>
					{
						isHover ?
						<IconContainer className="icon-colour-standard" asset={DropIcon} use-fill use-stroke/> :
						<IconContainer className="icon-colour-standard" asset={CategoryIcon} use-fill use-stroke/>
					}
					{
						currentlyEditing == section ?
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
