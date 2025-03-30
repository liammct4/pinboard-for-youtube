import { useContext, useEffect } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";
import { addDirectory, AddDirectoryFail, AddDirectorySuccess, directoryPathConcat, getItemFromNode, getParentPathFromPath, getRawSectionFromPrefix, getSectionFromPath, getSectionPrefix, getSectionRaw, getSectionType, IDirectoryNode, IVideoNode, reformatDirectoryPath, RelocateItemError, relocateItemToDirectory as relocateItemToDirectory, removeItems, VideoBrowserNode } from "../video/navigation/directory";
import { removeParentPass } from "../../lib/storage/userData/userData";
import { IVideo } from "../../lib/video/video";
import { getAlphanumericInsertIndex } from "../../lib/util/generic/stringUtil";
import { useDirectoryResource } from "./resources/useDirectoryResource";
import { useLocalStorage } from "./storage/useLocalStorage";
import { useVideosResource } from "./resources/useVideosResource";

export function useVideoStateAccess() {
	const { videoData, directoryRoot, counter, setCounter } = useContext<IVideoDirectoryContext>(VideoDirectoryContext);
	const { createAction, deleteAction, renameAction, moveAction, clearAllDirectories } = useDirectoryResource();
	const { updateAccountVideo, clearAllVideos } = useVideosResource();
	const { storage, setStorage } = useLocalStorage();

	useEffect(() => {
		if (directoryRoot == null) {
			return;
		}

		storage.user_data.videos = Array.from(videoData.values());
		storage.user_data.directoryRoot = removeParentPass(directoryRoot);

		setStorage(storage);
	}, [counter]);

	return {
		videoData,
		root: directoryRoot,
		directoryAddVideo: (videoID: string, path: string) => {
			if (videoData.has(videoID)) {
				return;
			}
			
			let newVideo: IVideo = {
				id: videoID,
				timestamps: []
			};
			videoData.set(videoID, newVideo);

			let desiredDirectory = getItemFromNode(path, directoryRoot) as IDirectoryNode;

			let newVideoNode: IVideoNode = {
				nodeID: crypto.randomUUID(),
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

			createAction(newVideoNode);
			updateAccountVideo(newVideo);
			setCounter(Math.random());
		},
		directoryRemoveVideo: (videoIDs: string[]) => {			
			for (let video of videoIDs) {
				if (videoData.has(video)){
					videoData.delete(video);
				}
			}
		
			setCounter(Math.random());
		},
		directoryUpdateVideo: (video: IVideo) => {
			if (!videoData.has(video.id)) {
				return;
			}

			videoData.set(video.id, video);

			updateAccountVideo(video);
			setCounter(Math.random());
		},
		directoryAdd: function (targetPath: string, name: string): AddDirectorySuccess | AddDirectoryFail {
			let result = addDirectory(directoryRoot, targetPath, name);

			let newNode = getItemFromNode(directoryPathConcat(targetPath, name, "DIRECTORY"), directoryRoot) as VideoBrowserNode;

			createAction(newNode);

			setCounter(Math.random());
			return result;
		},
		directoryMove: function (oldDirectory: string, newDirectory: string): RelocateItemError | null {
			setCounter(Math.random());

			let oldParent = reformatDirectoryPath(getParentPathFromPath(oldDirectory));
			let newParent = reformatDirectoryPath(getParentPathFromPath(newDirectory));
			
			let error = relocateItemToDirectory(directoryRoot, oldDirectory, newDirectory);
			
			if (error != null) {
				console.error(
					`Could not move the item.
						'${error}'
						'${oldDirectory}'
						'${newDirectory}'
					`
				);
				return error;
			}

			if (oldParent == newParent) {
				let section = getSectionFromPath(oldDirectory);

				if (section.type == "DIRECTORY") {
					let node = getItemFromNode(newDirectory, directoryRoot) as IDirectoryNode;
					renameAction(node, section.slices[0]);
				}
			}
			else {
				let node = getItemFromNode(newDirectory, directoryRoot) as IVideoNode;
				moveAction(node, oldDirectory);
			}

			return error;
		},
		directoryRemove: (path: string, sections: string[]) => {
			let parentNode = getItemFromNode(path, directoryRoot) as IDirectoryNode;

			for (let section of sections) {
				for (let node of parentNode.subNodes) {
					if (getSectionPrefix(node) == section) {
						deleteAction(node);
					}
				}
			}
			
			removeItems(directoryRoot, path, sections);
			setCounter(Math.random());
		},
		directoryClearAll: () => {
			directoryRoot.subNodes.splice(0, directoryRoot.subNodes.length);
			videoData.clear();

			clearAllVideos();
			clearAllDirectories();

			setCounter(Math.random());
		}
	}
}
