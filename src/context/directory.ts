import { createContext } from "react";
import { IDirectoryNode, NodeRef } from "../lib/directory/directory";

export interface IVideoDirectoryInteractionContext {
	navigateRequest: (requester: IDirectoryNode) => void;
	selectedItems: NodeRef[];
	setSelectedItems: (selectedItems: NodeRef[]) => void;
	currentlyEditing: NodeRef | null;
	requestEditStart: (node: NodeRef) => void;
	requestEditEnd: (newSliceName: string) => void;
	activateDeleteNodeDialog: (node: NodeRef) => void;
	draggingID: string | null;
}

export const VideoDirectoryInteractionContext = createContext<IVideoDirectoryInteractionContext>(
	{
		navigateRequest: () => console.error("Cannot navigate VideoDirectory due to no context provided."),
		selectedItems: [],
		setSelectedItems: () => console.error("No context provided: VideoDirectoryInteractionContext.setSelectedItems"),
		currentlyEditing: null,
		requestEditStart: () => console.error("No context provided: VideoDirectoryInteractionContext.requestEditStart"),
		requestEditEnd: () => console.error("No context provided: VideoDirectoryInteractionContext.requestEditEnd"),
		activateDeleteNodeDialog: () => console.error("No context provided: VideoDirectoryInteractionContext.activateDeleteNodeDialog"),
		draggingID: null
	}
);
