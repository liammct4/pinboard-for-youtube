import { createContext, useContext } from "react";
import { VideoTimestamp } from "../../VideoTimestamp/VideoTimestamp";
import { getNodePathIdentifier, IDirectoryNode, IVideoBrowserNode, VideoDirectoryInteractionContext } from "../directory"
import { ReactComponent as CategoryIcon } from "./../../../../../assets/icons/category.svg"
import "./VideoDirectory.css"
import { IconContainer } from "../../../images/svgAsset";

export interface IVideoDirectoryProperties {
	directoryData: IDirectoryNode;
}

interface IDirectoryItemProperties {
	// TODO
	node: IDirectoryNode,
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
					<DirectoryItem key={getNodePathIdentifier(node)} node={node as IDirectoryNode}/>
					:
					<p key={getNodePathIdentifier(node)}>Regular item placeholder</p>
			}
		</li>
	);
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

export function VideoDirectory({ directoryData }: IVideoDirectoryProperties): React.ReactNode {
	return (
		<ul className="video-directory-list">
			{directoryData.subNodes.map(x => <InteractableBrowserNode node={x}/>)}
		</ul>
	)
}
