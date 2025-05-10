import { createContext } from "react";
import { DragListItem } from "../../../../lib/dragList/DragListItem";
import { InteractableBrowserNode } from "./nodes/InteractableBrowserNode";
import { getNodeFromRef, IDirectoryNode } from "../../../../lib/directory/directory";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import "./VideoDirectory.css"
import { VideoPresentationStyle } from "../../../../lib/storage/tempState/layoutState";

export interface IVideoDirectoryProperties {
	directoryData: IDirectoryNode;
}

export function VideoDirectory({ directoryData }: IVideoDirectoryProperties): React.ReactNode {
	const tree = useSelector((state: RootState) => state.directory.videoBrowser);

	return (
		directoryData.subNodes.length > 0 ?
			<div className="video-directory-list">
				{
					directoryData.subNodes.map(x => 
						<DragListItem key={x} id={x}>
							<InteractableBrowserNode node={getNodeFromRef(tree, x)}/>
						</DragListItem>
					)	
				}
			</div>
			:
			<span className="empty-directory-message">Nothing to find here...</span>
	)
}

export interface IVideoDirectoryPresentationContext {
	videoItemStyle: VideoPresentationStyle;
}

export const VideoDirectoryPresentationContext = createContext<IVideoDirectoryPresentationContext>({
	videoItemStyle: "REGULAR"
});
