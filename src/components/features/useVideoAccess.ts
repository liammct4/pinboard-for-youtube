import { useContext } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";

export function useVideoAccess() {
	const { videoData, directoryRoot } = useContext<IVideoDirectoryContext>(VideoDirectoryContext);

	return {
		videoData,
		root: directoryRoot,
		addVideo: (videoID: string) => {
			if (videoData.has(videoID)) {
				return;
			}
			
			videoData.set(videoID, {
				id: videoID,
				timestamps: [],
				appliedTags: []
			})
		},
		removeVideo: (videoID: string) => {
			if (videoData.has(videoID)){
				videoData.delete(videoID);
			}
		}
	}
}
