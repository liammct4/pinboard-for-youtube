import { createContext, Context } from "react"
import { IVideo } from "../lib/video/video";
import { IDirectoryNode } from "../lib/directory/directory";

export interface IVideoDirectoryContext {
	updateCount: number;
	directoryRoot: IDirectoryNode;
	counter: number;
	setCounter: (newNumber: number) => void;
}

export const VideoContext: Context<IVideo> = createContext<IVideo>(null!);
export const VideoDirectoryContext: Context<IVideoDirectoryContext> = createContext<IVideoDirectoryContext>(null!);
