import { createContext } from "react";
import { IDirectoryNode } from "../lib/directory/directory";

export interface IVideoDirectoryInteractionContext {
	navigateRequest: (requester: IDirectoryNode) => void;
	selectedItems: string[];
	setSelectedItems: (selectedItems: string[]) => void;
	currentlyEditing: string | null;
	requestEditEnd: (newSliceName: string) => void;
	draggingID: string | null;
}

export const VideoDirectoryInteractionContext = createContext<IVideoDirectoryInteractionContext>(
	{
		navigateRequest: () => console.error("Cannot navigate VideoDirectory due to no context provided."),
		selectedItems: [],
		setSelectedItems: () => console.error("No context provided: VideoDirectoryInteractionContext.setSelectedItems"),
		currentlyEditing: null,
		requestEditEnd:  () => console.error("No context provided: VideoDirectoryInteractionContext.requestEditEnd"),
		draggingID: null,
	}
);
