import { useContext } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";
import { addDirectory, AddDirectoryFail, AddDirectorySuccess, directoryPathConcat, getItemFromPath, getParentPathFromPath, getSectionFromPath, getSectionPrefix, getSectionRaw, getSectionType, IDirectoryNode, IVideoNode, reformatDirectoryPath, RelocateItemError, relocateItemToDirectory as relocateItemToDirectory, removeItems, VideoBrowserNode } from "../../lib/directory/directory";
import { IVideo } from "../../lib/video/video";
import { getAlphanumericInsertIndex } from "../../lib/util/generic/stringUtil";
import { useDirectoryResource } from "./resources/useDirectoryResource";
import { useVideosResource } from "./resources/useVideosResource";
import { useVideoCache } from "./useVideoInfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useVideo } from "./useVideo";
import { addOrReplaceVideo, clearVideos, removeVideo } from "../../features/video/videoSlice";

export function useVideoStateAccess() {
	const { directoryRoot, setCounter } = useContext<IVideoDirectoryContext>(VideoDirectoryContext);
	const { createAction, deleteAction, renameAction, moveAction, clearAllDirectories } = useDirectoryResource();
	const { updateAccountVideo, removeAccountVideo, clearAllVideos } = useVideosResource();
	const { retrieveInfo } = useVideoCache();
	const dispatch = useDispatch();
	const { videoExists, getVideo } = useVideo();

	return {
		root: directoryRoot,
		directoryAddVideo: async (videoID: string, path: string): Promise<IVideo> => {
			if (videoExists(videoID)) {
				return getVideo(videoID) as IVideo;
			}
			
			let newVideo: IVideo = {
				id: videoID,
				timestamps: []
			};

			dispatch(addOrReplaceVideo(newVideo));

			let desiredDirectory = getItemFromPath(path, directoryRoot) as IDirectoryNode;

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
				if (videoExists(video)){
					dispatch(removeVideo(video));
					removeAccountVideo(video);
				}
			}
			
			setCounter(Math.random());
		},
		directoryUpdateVideo: (video: IVideo) => {
			if (!videoExists(video.id)) {
				return;
			}

			dispatch(addOrReplaceVideo(video));

			updateAccountVideo(video);
			setCounter(Math.random());
		},
		directoryAdd: async function (targetPath: string, name: string): Promise<AddDirectorySuccess | AddDirectoryFail> {
			let result = await addDirectory(directoryRoot, targetPath, name);

			let newNode = getItemFromPath(directoryPathConcat(targetPath, name, "DIRECTORY"), directoryRoot) as VideoBrowserNode;

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
					let node = getItemFromPath(newDirectory, directoryRoot) as IDirectoryNode;
					renameAction(node, section.slices[0]);
				}
			}
			else {
				let node = getItemFromPath(newDirectory, directoryRoot) as IVideoNode;
				moveAction(node, oldDirectory);
			}

			return error;
		},
		directoryRemove: (path: string, sections: string[]) => {
			let parentNode = getItemFromPath(path, directoryRoot) as IDirectoryNode;

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
			dispatch(clearVideos());

			clearAllVideos();
			clearAllDirectories();

			setCounter(Math.random());
		}
	}
}
