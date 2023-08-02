import { createContext, Context } from "react"
import { Video } from "../lib/video/video";
import { ActionCreatorWithPayload, ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

export type VideoContext = {
	activeVideoID: string | undefined,
	videos: Array<Video>,
	openVideos: Array<string>,
	actions: {
		addVideo: ActionCreatorWithPayload<Video, "video/addVideo">,
		updateVideo: ActionCreatorWithPayload<Video, "video/updateVideo">,
		clearVideos: ActionCreatorWithoutPayload<"video/clearVideos">,
		setVideos: ActionCreatorWithPayload<Array<Video>, "video/setVideos">,
		addExpandedID: ActionCreatorWithPayload<string, "tempState/addExpandedID">,
		removeExpandedID: ActionCreatorWithPayload<string, "tempState/removeExpandedID">
	}
}

export const VideoListContext: Context<VideoContext> = createContext<VideoContext>(null!);
export const VideoContext: Context<Video> = createContext<Video>(null!);
