import { createContext, useContext } from "react";
import { VideoTimestamp } from "../../VideoTimestamp/VideoTimestamp";
import { getNodePathIdentifier, IDirectoryNode, IVideoBrowserNode, IVideoNode, VideoDirectoryInteractionContext } from "../directory"
import { ReactComponent as CategoryIcon } from "./../../../../../assets/icons/category.svg"
import { IconContainer } from "../../../images/svgAsset";
import "./VideoDirectory.css"
import { VideoPresentationStyle } from "../VideoDirectoryBrowser/VideoDirectoryBrowser";
import { CompactVideoItem } from "../../styledVideoItems/CompactVideoItem/CompactVideoItem";
import { MinimalVideoItem } from "../../styledVideoItems/MinimalVideoItem/MinimalVideoItem";
import { RegularVideoItem } from "../../styledVideoItems/RegularVideoItem/RegularVideoItem";
import { useVideoStateAccess } from "../../../features/useVideoStateAccess";
import { IVideo, Timestamp } from "../../../../lib/video/video";
import { VideoItemContext } from "../../styledVideoItems/VideoItem";

export interface IVideoDirectoryProperties {
	directoryData: IDirectoryNode;
}

interface IInteractableBrowserNodeProperties {
	node: IVideoBrowserNode;
}

function InteractableBrowserNode({ node }: IInteractableBrowserNodeProperties): React.ReactNode {
	let isDirectoryNode = node.type == "DIRECTORY";

	return (
		<li
			className={`node-item ${isDirectoryNode ? "directory-node-item" : "video-node-item"}`}
			data-is-hover-highlight={isDirectoryNode}>
			{
				isDirectoryNode ?
					<DirectoryItem node={node as IDirectoryNode}/>
					:
					<VideoItem node={node as IVideoNode}/>
			}
		</li>
	);
}

interface IDirectoryItemProperties {
	node: IDirectoryNode
}

function DirectoryItem({ node }: IDirectoryItemProperties): React.ReactNode {
	const { navigateRequest } = useContext(VideoDirectoryInteractionContext);

	return (
		<>
			<div>
				<button className="enter-navigate-button" onClick={() => navigateRequest(node)}>
					<IconContainer className="icon-colour-standard" asset={CategoryIcon} use-stroke use-fill/>
					<span>{node.slice}</span>
				</button>
			</div>
		</>
	)
}

interface IVideoItemProperties {
	node: IVideoNode;
}

function VideoItem({ node }: IVideoItemProperties): React.ReactNode {
	const { videoItemStyle } = useContext<IVideoDirectoryPresentationContext>(VideoDirectoryPresentationContext);
	const { videoData, updateVideo } = useVideoStateAccess();

	if (!videoData.has(node.videoID)) {
		console.error(`Could not retrive video ID. Video ID of ${node.videoID} exists but no matching video was found.`);
		return <p>ERROR</p>;
	}
	
	let video = videoData.get(node.videoID) as IVideo;

	const onTimestampChanged = (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => {
		let newVideo = { ...video };
		let index = newVideo.timestamps.findIndex(x => x.id == oldTimestamp.id);

		if (index == -1) {
			console.error("Timestamp doesn't exist.");
			return;	
		}

		if (newTimestamp == null) {
			newVideo.timestamps.splice(index, 1);
		}
		else {	
			newVideo.timestamps[index] = newTimestamp;
		}

		updateVideo(newVideo);
	};

	const onTimestampAdded = (newTimestamp: Timestamp) => {
		let newVideo = { ...video };

		newVideo.timestamps.push(newTimestamp);

		updateVideo(newVideo);
	}

	let styleItem;
	
	switch (videoItemStyle) {
		case "COMPACT":
			styleItem = <CompactVideoItem/>;
			break;
		case "MINIMAL":
			styleItem = <MinimalVideoItem/>;
			break;
		case "REGULAR":
			styleItem = <RegularVideoItem/>
			break;
	}

	return (
		<VideoItemContext.Provider value={{
			video,
			onTimestampAdded,
			onTimestampChanged
		}}>
			{styleItem}
		</VideoItemContext.Provider>
	);
}

export function VideoDirectory({ directoryData }: IVideoDirectoryProperties): React.ReactNode {
	return (
		<ul className="video-directory-list">
			{directoryData.subNodes.map(x => <InteractableBrowserNode key={getNodePathIdentifier(x)} node={x}/>)}
		</ul>
	)
}

export interface IVideoDirectoryPresentationContext {
	videoItemStyle: VideoPresentationStyle;
}

export const VideoDirectoryPresentationContext = createContext<IVideoDirectoryPresentationContext>({
	videoItemStyle: "REGULAR"
});
