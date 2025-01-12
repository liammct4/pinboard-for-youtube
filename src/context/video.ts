import { createContext, Context } from "react"
import { ITagDefinition, IVideo } from "../lib/video/video";
import { ActionCreatorWithPayload, ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { IDirectoryNode } from "../components/video/navigation/directory";

export interface IVideoDirectoryContext {
	videoData: Map<string, IVideo>;
	directoryRoot: IDirectoryNode
}

export interface IVideoContext {
	activeVideoID: string | undefined,
	videos: IVideo[],
	openVideos: string[],
	tagDefinitions: ITagDefinition[],
	deleteMode: boolean
	actions: {
		addVideo: ActionCreatorWithPayload<IVideo, "video/addVideo">,
		updateVideo: ActionCreatorWithPayload<IVideo, "video/updateVideo">,
		removeVideo: ActionCreatorWithPayload<string, "video/removeVideo">,
		clearVideos: ActionCreatorWithoutPayload<"video/clearVideos">,
		setVideos: ActionCreatorWithPayload<IVideo[], "video/setVideos">,
		addExpandedID: ActionCreatorWithPayload<string, "tempState/addExpandedID">,
		removeExpandedID: ActionCreatorWithPayload<string, "tempState/removeExpandedID">
	},
}

export const VideoListContext: Context<IVideoContext> = createContext<IVideoContext>(null!);
export const VideoContext: Context<IVideo> = createContext<IVideo>(null!);
export const VideoDirectoryContext: Context<IVideoDirectoryContext> = createContext<IVideoDirectoryContext>(null!);
