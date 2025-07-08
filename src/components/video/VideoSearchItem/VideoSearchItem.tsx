import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import "./VideoSearchItem.css"
import { VideoThumbnail } from "../VideoThumbnail/VideoThumbnail";
import { getNodeFromVideoID, getPathOfNode, NodeRef } from "../../../lib/directory/directory";
import { useMemo } from "react";
import { getParentPathFromPath, NodePath, pathToString } from "../../../lib/directory/path";

export interface IVideoSearchItemProperties {
	videoID: string;
	onNavigate: (path: NodePath) => void;
}

export function VideoSearchItem({ videoID, onNavigate }: IVideoSearchItemProperties) {
	const info = useSelector((state: RootState) => state.cache.videoCache.find(x => x.video_id == videoID));
	const tree = useSelector((state: RootState) => state.directory.videoBrowser);
	const node = useMemo(() => getNodeFromVideoID(tree, videoID) as NodeRef, [videoID]);
	const path = useMemo(() => getParentPathFromPath(getPathOfNode(tree, node) as NodePath), [tree, node]);

	if (path == null) {
		return <p>Error</p>
	}

	const parentPath = pathToString(path);

	return (
		<li className="video-search-item">
			<VideoThumbnail className="thumbnail" videoID={videoID} width={60} alt=""/>
			<span className="title">{info?.title}</span>
			<button
				className="navigate-button"
				title={`Jump to location: ${parentPath}`}
				onClick={() => onNavigate(path)}>
					{parentPath}
			</button>
		</li>
	)
}
