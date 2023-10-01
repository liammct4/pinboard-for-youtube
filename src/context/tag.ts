import { createContext } from "react"
import { TagDefinition } from "../lib/video/video";

export type ITagItemContext = {
	crossButtonPress: (tag: TagDefinition) => void;
	tagButtonPress: (tag: TagDefinition) => void;
}

export const TagItemContext = createContext<ITagItemContext>(null!);
