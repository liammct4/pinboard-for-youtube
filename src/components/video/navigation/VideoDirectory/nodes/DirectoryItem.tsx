import { useContext } from "react";
import { ReactComponent as CategoryIcon } from "./../../../../../../assets/icons/category.svg"
import { IDirectoryNode, VideoDirectoryInteractionContext } from "../../directory";
import { IconContainer } from "../../../../images/svgAsset";

interface IDirectoryItemProperties {
	node: IDirectoryNode;
}

export function DirectoryItem({ node }: IDirectoryItemProperties): React.ReactNode {
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
