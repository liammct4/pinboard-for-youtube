import { useContext, useEffect } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";
import { addDirectory, AddDirectoryResult, getItemFromNode, getSectionRaw, IDirectoryNode, IVideoNode, RelocateItemError, relocateItemToDirectory as relocateItemToDirectory, removeItems } from "../video/navigation/directory";
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
		directoryAddVideo: (videoID: string, path: string) => {
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

			if (directoryStartIndex == -1) {
				directoryStartIndex = desiredDirectory.subNodes.length;
			}

			let insertIndex = getAlphanumericInsertIndex(
				desiredDirectory.subNodes,
				newVideoNode,
				getSectionRaw,
				directoryStartIndex,
				desiredDirectory.subNodes.length
			);

			desiredDirectory.subNodes.splice(insertIndex, 0, newVideoNode);
			
			setCounter(Math.random());
		},
		directoryRemoveVideo: (videoID: string) => {
			if (videoData.has(videoID)){
				videoData.delete(videoID);
			}
			setCounter(Math.random());
		},
		directoryUpdateVideo: (video: IVideo) => {
			if (!videoData.has(video.id)) {
				return;
			}

			videoData.set(video.id, video);

			setCounter(Math.random());
		},
		directoryAdd: function (targetPath: string, name: string): AddDirectoryResult {
			let result = addDirectory(directoryRoot, targetPath, name);

			setCounter(Math.random());
			return result;
		},
		directoryMove: function (oldDirectory: string, newDirectory: string): RelocateItemError | null {
			setCounter(Math.random());
			return relocateItemToDirectory(directoryRoot, oldDirectory, newDirectory);
		},
		directoryRemove: (path: string, sections: string[]) => {
			removeItems(directoryRoot, path, sections);
			setCounter(Math.random());
		}
	}
}
