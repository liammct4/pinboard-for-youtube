import { useContext, useEffect } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";
import { getItemFromNode, IDirectoryNode, IVideoNode } from "../video/navigation/directory";
import { saveDirectoryToStorage, setStoredVideos } from "../../lib/storage/userData/userData";
import { IVideo } from "../../lib/video/video";

export function useVideoStateAccess() {
	const { videoData, directoryRoot, counter, setCounter } = useContext<IVideoDirectoryContext>(VideoDirectoryContext);

	useEffect(() => {
		setStoredVideos(videoData);
		saveDirectoryToStorage(directoryRoot);
	}, [counter]);

	return {
		videoData,
		root: directoryRoot,
		addVideo: (videoID: string, path: string) => {
			if (videoData.has(videoID)) {
				return;
			}
			
			videoData.set(videoID, {
				id: videoID,
				timestamps: [],
				appliedTags: []
			});

			let desiredDirectory = getItemFromNode(path, directoryRoot) as IDirectoryNode;

			let newVideoNode: IVideoNode = {
				type: "VIDEO",
				parent: desiredDirectory,
				videoID: videoID,
			};

			desiredDirectory.subNodes.push(newVideoNode);
			
			setCounter(Math.random());
		},
		removeVideo: (videoID: string) => {
			if (videoData.has(videoID)){
				videoData.delete(videoID);
			}
			setCounter(Math.random());
		},
		updateVideo: (video: IVideo) => {
			if (!videoData.has(video.id)) {
				return;
			}

			videoData.set(video.id, video);

			setCounter(Math.random());
		}
	}
}
