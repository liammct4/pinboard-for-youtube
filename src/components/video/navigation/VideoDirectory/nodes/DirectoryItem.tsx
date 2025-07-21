/// <reference types="vite-plugin-svgr/client" />

import { useContext, useEffect, useRef, useState } from "react";
import CategoryIcon from "./../../../../../../assets/icons/category.svg?react"
import DropIcon from "./../../../../../../assets/icons/drop_in.svg?react"
import RenameIcon from "./../../../../../../assets/icons/rename.svg?react"
import { IconContainer } from "../../../../images/svgAsset";
import { VideoDirectoryInteractionContext } from "../../../../../context/directory";
import { IDirectoryNode } from "../../../../../lib/directory/directory";
import { SmallButton } from "../../../../interactive/buttons/SmallButton/SmallButton";

interface IDirectoryItemProperties {
	node: IDirectoryNode;
}

export function DirectoryItem({ node }: IDirectoryItemProperties): React.ReactNode {
	const {
		navigateRequest,
		currentlyEditing,
		requestEditStart,
		requestEditEnd,
		draggingID
	} = useContext(VideoDirectoryInteractionContext);
	const [ editSlice, setEditSlice ] = useState<string>(node.slice);
	const wasEditing = useRef<boolean>(false);

	useEffect(() => {
		// Reset to default valid value.
		if (currentlyEditing == node.nodeID) {
			setEditSlice(node.slice);
		}

		wasEditing.current = currentlyEditing == node.nodeID;
	}, [currentlyEditing]);

	let isHover = draggingID == node.slice;

	return (
		<div className="directory-item-outer">
			<button data-focus data-is-hover-overlap={isHover} className="enter-navigate-button" onDoubleClick={() => navigateRequest(node)}>
				{
					isHover ?
					<IconContainer className="icon-colour-standard" asset={DropIcon} use-fill use-stroke/> :
					<IconContainer className="icon-colour-standard" asset={CategoryIcon} use-fill use-stroke/>
				}
				{
					currentlyEditing == node.nodeID ?
					<input
						className="medium-text-input"
						onBlur={() => {
							requestEditEnd(editSlice);
							wasEditing.current = false;
						}}
						onKeyDown={(e) => {
							if (e.key == "Enter") {
								requestEditEnd(e.currentTarget.value);
								wasEditing.current = false;
							}
						}}
						onDoubleClick={(e) => e.stopPropagation()}
						onClick={(e) => e.stopPropagation()}
						onMouseDown={(e) => e.stopPropagation()}
						onMouseUp={(e) => e.stopPropagation()}
						value={editSlice}
						onChange={(e) => setEditSlice(e.target.value)}
						autoFocus/> :
					<span>{node.slice}</span>
				}
			</button>
			<SmallButton
				className="rename-button"
				onClick={() => {
					if (wasEditing.current) {
						wasEditing.current = false;
					}
					else {
						requestEditStart(node.nodeID);
					}
				}}
				title="Rename this directory.">
					<IconContainer
						className="icon-colour-standard"
						asset={RenameIcon}
						use-fill
						use-stroke/>
			</SmallButton>
		</div>
	)
}
