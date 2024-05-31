import { createContext } from "react"
import { ITagDefinition } from "../lib/video/video";

export type ITagItemContext = {
	crossButtonPress: (tag: ITagDefinition) => void;
	tagButtonPress: (tag: ITagDefinition) => void;
}

export const TagItemContext = createContext<ITagItemContext>(null!);
