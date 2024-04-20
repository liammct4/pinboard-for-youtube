import { createContext, Context } from "react"
import { TagDefinition, Video } from "../lib/video/video";
import { ActionCreatorWithPayload, ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

export interface IVideoContext {
	activeVideoID: string | undefined,
	videos: Array<Video>,
	openVideos: Array<string>,
	tagDefinitions: Array<TagDefinition>,
	deleteMode: boolean
	actions: {
		addVideo: ActionCreatorWithPayload<Video, "video/addVideo">,
		updateVideo: ActionCreatorWithPayload<Video, "video/updateVideo">,
		removeVideo: ActionCreatorWithPayload<string, "video/removeVideo">,
		clearVideos: ActionCreatorWithoutPayload<"video/clearVideos">,
		setVideos: ActionCreatorWithPayload<Array<Video>, "video/setVideos">,
		addExpandedID: ActionCreatorWithPayload<string, "tempState/addExpandedID">,
		removeExpandedID: ActionCreatorWithPayload<string, "tempState/removeExpandedID">
	},
}

export const VideoListContext: Context<IVideoContext> = createContext<IVideoContext>(null!);
export const VideoContext: Context<Video> = createContext<Video>(null!);
