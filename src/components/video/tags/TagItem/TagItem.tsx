import { useContext } from "react";
import { ITagDefinition } from "../../../../lib/video/video";
import "./TagItem.css"
import { TagItemContext } from "../../../../context/tag";
import { ReactComponent as CrossIcon } from "./../../../../../assets/symbols/cross.svg"
import { IconContainer } from "../../../images/svgAsset";

interface ITagItemProperties {
	tagDefinition: ITagDefinition;
	selected?: boolean
}

export function TagItem({ tagDefinition, selected }: ITagItemProperties): React.ReactNode {
	const { crossButtonPress, tagButtonPress } = useContext(TagItemContext);

	return (
		<div className="tag-bubble" data-selected={selected}>
			<button className="delete-button" onClick={() => crossButtonPress(tagDefinition)}>
				<IconContainer className="icon-colour-standard delete-icon" asset={CrossIcon} use-stroke/>
			</button>
			<button className="button-invisible tag-name-button" onClick={() => tagButtonPress(tagDefinition)}>{tagDefinition.name}</button>
		</div>
	);
}
