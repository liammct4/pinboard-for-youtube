import { createContext } from "react";

export interface IVideoDirectoryBrowserContext {
	selectedItems: string[];
	setSelectedItems: (sections: string[]) => void;
}

export const VideoDirectoryBrowserContext = createContext<IVideoDirectoryBrowserContext>({
	selectedItems: [],
	setSelectedItems: () => console.error("VideoDirectoryBrowserContext.setSelectedItems: Not Set.")
});
