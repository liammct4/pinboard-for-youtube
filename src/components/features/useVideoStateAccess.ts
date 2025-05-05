import { useContext } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";
import { addDirectory, AddDirectoryFail, AddDirectorySuccess, directoryPathConcat, getNodeFromPath, getParentPathFromPath, getSectionFromPath, getSectionPrefix, getSectionRaw, getSectionType, IDirectoryNode, IVideoNode, reformatDirectoryPath, RelocateItemError, relocateItemToDirectory as relocateItemToDirectory, removeItems, VideoBrowserNode } from "../../lib/directory/directory";
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
		root: directoryRoot
	}
}
