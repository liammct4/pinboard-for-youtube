import { createContext } from "react";
import { NodeRef } from "../../../../lib/directory/directory";

export interface IVideoDirectoryBrowserContext {
	selectedItems: NodeRef[];
	setSelectedItems: (sections: NodeRef[]) => void;
	currentlyEditing: NodeRef | null;
	setCurrentlyEditing: (editing: NodeRef | null) => void;
}

export const VideoDirectoryBrowserContext = createContext<IVideoDirectoryBrowserContext>({
	selectedItems: [],
	setSelectedItems: () => console.error("VideoDirectoryBrowserContext.setSelectedItems: Not Set."),
	currentlyEditing: null,
	setCurrentlyEditing: () => console.error("VideoDirectoryBrowserContext.setCurrentlyEditing: Not Set."),
});
