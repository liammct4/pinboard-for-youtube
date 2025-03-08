import { createContext } from "react";
import { getSectionPrefix, IDirectoryNode } from "../directory"
import "./VideoDirectory.css"
import { VideoPresentationStyle } from "../VideoDirectoryBrowser/VideoDirectoryBrowser";
import { DragListItem } from "../../../../lib/dragList/DragListItem";
import { InteractableBrowserNode } from "./nodes/InteractableBrowserNode";

export interface IVideoDirectoryProperties {
	directoryData: IDirectoryNode;
}

export function VideoDirectory({ directoryData }: IVideoDirectoryProperties): React.ReactNode {
	return (
		directoryData.subNodes.length > 0 ?
			<ul className="video-directory-list">
				{
					directoryData.subNodes.map(x => 
						<DragListItem key={getSectionPrefix(x)} id={getSectionPrefix(x)}>
							<InteractableBrowserNode node={x}/>
						</DragListItem>
					)	
				}
			</ul>
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
