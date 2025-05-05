/// <reference types="vite-plugin-svgr/client" />

import { useContext } from "react";
import CategoryIcon from "./../../../../../../assets/icons/category.svg?react"
import DropIcon from "./../../../../../../assets/icons/drop_in.svg?react"
import { IconContainer } from "../../../../images/svgAsset";
import { VideoDirectoryInteractionContext } from "../../../../../context/directory";
import { IDirectoryNode } from "../../../../../lib/directory/directory";

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
	let isHover = draggingID == node.slice;

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
