import { createContext } from "react";

export interface IVideoDirectoryBrowserContext {
	selectedItems: string[];
	setSelectedItems: (sections: string[]) => void;
	currentlyEditing: string | null;
	setCurrentlyEditing: (editing: string | null) => void;
}

export const VideoDirectoryBrowserContext = createContext<IVideoDirectoryBrowserContext>({
	selectedItems: [],
	setSelectedItems: () => console.error("VideoDirectoryBrowserContext.setSelectedItems: Not Set."),
	currentlyEditing: null,
	setCurrentlyEditing: () => console.error("VideoDirectoryBrowserContext.setCurrentlyEditing: Not Set."),
});
