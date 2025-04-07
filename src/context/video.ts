import { createContext, Context } from "react"
import { IVideo } from "../lib/video/video";
import { IDirectoryNode } from "../components/video/navigation/directory";

export interface IVideoDirectoryContext {
	videoData: Map<string, IVideo>;
	directoryRoot: IDirectoryNode;
	counter: number;
	setCounter: (newNumber: number) => void;
}

export const VideoContext: Context<IVideo> = createContext<IVideo>(null!);
export const VideoDirectoryContext: Context<IVideoDirectoryContext> = createContext<IVideoDirectoryContext>(null!);
