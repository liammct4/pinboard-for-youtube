import { useContext, useEffect, useRef, useState } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";
import { addDirectory, AddDirectoryFail, AddDirectorySuccess, cloneDirectory, directoryPathConcat, getItemFromNode, getParentPathFromPath, getRawSectionFromPrefix, getSectionFromPath, getSectionPrefix, getSectionRaw, getSectionType, IDirectoryNode, IVideoNode, reformatDirectoryPath, RelocateItemError, relocateItemToDirectory as relocateItemToDirectory, removeItems, VideoBrowserNode } from "../video/navigation/directory";
import { addParentPass, removeParentPass } from "../../lib/storage/userData/userData";
import { IVideo } from "../../lib/video/video";
import { getAlphanumericInsertIndex } from "../../lib/util/generic/stringUtil";
import { useDirectoryResource } from "./resources/useDirectoryResource";
import { useLocalStorage } from "./storage/useLocalStorage";
import { useVideosResource } from "./resources/useVideosResource";
import { useVideoCache } from "./useVideoInfo";
import { accessStorage } from "../../lib/storage/storage";

export function useVideoStateAccess() {
	const preventUpdate = useRef<boolean>(true);
	const { videoData, directoryRoot, counter, setCounter } = useContext<IVideoDirectoryContext>(VideoDirectoryContext);
	const { createAction, deleteAction, renameAction, moveAction, clearAllDirectories } = useDirectoryResource();
	const { updateAccountVideo, removeAccountVideo, clearAllVideos } = useVideosResource();
	const { retrieveInfo } = useVideoCache();
	const { storage, setStorage } = useLocalStorage();

	useEffect(() => {
		if (counter == 0) {
			return;
		}

		preventUpdate.current = true;
		storage.userData.videos = Array.from(videoData.values());
		storage.userData.directoryRoot = removeParentPass(directoryRoot);

		setStorage(storage);
	}, [counter]);

	useEffect(() => {
		setTimeout(() => {
			if (preventUpdate.current) {
				preventUpdate.current = false;
				return;
			}
	
			// Means an external source modified the storage, so update the state.
			const update = async () => {
				let storage = await accessStorage();
				videoData.clear();
				storage.userData.videos.forEach(x => videoData.set(x.id, x));
				directoryRoot.subNodes = cloneDirectory(storage.userData.directoryRoot).subNodes;

				// Update so the parent references the same object.
				directoryRoot.subNodes.forEach(x => x.parent = directoryRoot);

				addParentPass(directoryRoot);
			}
	
			update();
		}, 100);
	}, [counter, JSON.stringify(storage.userData)]);

	return {
		videoData,
		root: directoryRoot,
		directoryAddVideo: async (videoID: string, path: string): Promise<IVideo> => {
			if (videoData.has(videoID)) {
				return videoData.get(videoID) as IVideo;
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

			let insertIndex = await getAlphanumericInsertIndex(
				desiredDirectory.subNodes,
				newVideoNode,
				async (n) => n.type == "VIDEO" ? (await retrieveInfo(n.videoID))!.title : "",
				directoryStartIndex,
				desiredDirectory.subNodes.length
			);

			desiredDirectory.subNodes.splice(insertIndex, 0, newVideoNode);

			createAction(newVideoNode);
			updateAccountVideo(newVideo);
			setCounter(Math.random());

			return newVideo;
		},
		directoryRemoveVideo: (videoIDs: string[]) => {
			for (let video of videoIDs) {
				if (videoData.has(video)){
					videoData.delete(video);
					removeAccountVideo(video);
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
		directoryAdd: async function (targetPath: string, name: string): Promise<AddDirectorySuccess | AddDirectoryFail> {
			let result = await addDirectory(directoryRoot, targetPath, name);

			let newNode = getItemFromNode(directoryPathConcat(targetPath, name, "DIRECTORY"), directoryRoot) as VideoBrowserNode;

			createAction(newNode);

			setCounter(Math.random());
			return result;
		},
		directoryMove: async function (oldDirectory: string, newDirectory: string): Promise<RelocateItemError | null> {
			setCounter(Math.random());

			let oldParent = reformatDirectoryPath(getParentPathFromPath(oldDirectory));
			let newParent = reformatDirectoryPath(getParentPathFromPath(newDirectory));
			
			let error = await relocateItemToDirectory(directoryRoot, oldDirectory, newDirectory);
			
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
