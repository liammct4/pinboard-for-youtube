import { useContext } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";

export function useVideoAccess() {
	const videos = useContext<IVideoDirectoryContext>(VideoDirectoryContext);

	return {
		videos,
		addVideo: (videoID: string) => {
			if (videos.videoData.has(videoID)) {
				return;
			}
			
			videos.videoData.set(videoID, {
				id: videoID,
				timestamps: [],
				appliedTags: []
			})
		},
		removeVideo: (videoID: string) => {
			if (videos.videoData.has(videoID)){
				videos.videoData.delete(videoID);
			}
		}
	}
}
