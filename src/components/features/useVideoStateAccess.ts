import { useContext, useEffect } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";
import { getItemFromNode, IDirectoryNode, IVideoNode, relocateDirectory, removeItems } from "../video/navigation/directory";
import { saveDirectoryToStorage, setStoredVideos } from "../../lib/storage/userData/userData";
import { IVideo } from "../../lib/video/video";
import { getAlphanumericInsertIndex } from "../../lib/util/generic/stringUtil";

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

			let directoryStartIndex = desiredDirectory.subNodes.findIndex(x => x.type == "VIDEO");
			let insertIndex = getAlphanumericInsertIndex(desiredDirectory.subNodes, newVideoNode, (item) => (item as IDirectoryNode).slice, directoryStartIndex, desiredDirectory.subNodes.length);

			desiredDirectory.subNodes.splice(insertIndex, 0, newVideoNode);
			
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
		},
		move: (oldDirectory: string, newDirectory: string) => {
			relocateDirectory(directoryRoot, oldDirectory, newDirectory);
			setCounter(Math.random());
		},
		remove: (path: string, sections: string[]) => {
			removeItems(directoryRoot, path, sections);
			setCounter(Math.random());
		}
	}
}
