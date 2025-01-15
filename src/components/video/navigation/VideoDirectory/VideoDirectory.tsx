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
import { useVideoAccess } from "../../../features/useVideoAccess";
import { IVideo } from "../../../../lib/video/video";

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
	const { videoData } = useVideoAccess();

	if (!videoData.has(node.videoID)) {
		console.error(`Could not retrive video ID. Video ID of ${node.videoID} exists but no matching video was found.`);
		return <p>ERROR</p>;
	}
	
	let video = videoData.get(node.videoID) as IVideo;
	
	switch (videoItemStyle) {
		case "COMPACT":
			return <CompactVideoItem video={video}/>;
		case "MINIMAL":
			return <MinimalVideoItem video={video}/>;
		case "REGULAR":
			return <RegularVideoItem video={video}/>;
	}
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
