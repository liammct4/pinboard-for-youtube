import { useContext } from "react";
import { TagDefinition } from "../../../../lib/video/video";
import "./TagItem.css"
import { TagItemContext } from "../../../../context/tag";
import { ReactComponent as CrossIcon } from "./../../../../../assets/symbols/cross.svg"
import { IconContainer } from "../../../images/svgAsset";

interface ITagItemProperties {
	tagDefinition: TagDefinition;
	selected?: boolean
}

export function TagItem({ tagDefinition, selected }: ITagItemProperties): React.ReactNode {
	const { crossButtonPress, tagButtonPress } = useContext(TagItemContext);

	return (
		<div className="tag-bubble" onClick={() => tagButtonPress(tagDefinition)} data-selected={selected}>
			<button className="delete-button" onClick={() => crossButtonPress(tagDefinition)}>
				<IconContainer className="icon-colour-standard delete-icon" asset={CrossIcon} use-stroke/>
			</button>
			<span className="tag-name">{tagDefinition.name}</span>
		</div>
	);
}
