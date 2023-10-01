import { useContext, useState } from "react";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { addTagDefinition, removeTagDefinition } from "../../features/videos/videoSlice";
import { TagDefinition } from "../../lib/video/video";
import { v4 as uuid } from "uuid"
import { IconContainer } from "../../components/images/svgAsset";
import { ReactComponent as CrossIcon } from "./../../../assets/symbols/cross.svg"
import { ReactComponent as ArrowIcon } from "./../../../assets/symbols/arrow.svg"
import SplitHeading from "../../components/presentation/SplitHeading/SplitHeading";
import { TagItemContext } from "../../context/tag";
import "./TagsPage.css"

interface ITagItemProperties {
	tagDefinition: TagDefinition;
	selected?: boolean
}

function resolveNewTag(tagDefinitions: Array<TagDefinition>): string {
	let resolved = false;
	let next = 1;

	while (!resolved) {
		let nextTag = `New Tag ${next++}`;

		if (tagDefinitions.find(x => x.name == nextTag) == null) {
			return nextTag;
		}
	}

	// This should never be reached...
	return "New Tag";
}

function TagItem({ tagDefinition, selected }: ITagItemProperties): React.ReactNode {
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

export function TagsPage(): React.ReactNode {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const tagDefinitions = useSelector((state: RootState) => state.video.tagDefinitions);
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	return (
		<>
			<div className="button-row">
				<button className="circle-button" onClick={() => navigate("./videos/")}>
					<IconContainer className="icon-colour-standard go-back-arrow" asset={ArrowIcon} use-stroke/>
				</button>
				<span className="go-back-text">Go Back</span>
			</div>
			<hr className="bold-separator"/>
			<SplitHeading text="Custom Tags"/>
			<p className="tag-description">You can use tags to organize videos, use the dropdown in the main dashboard to filter videos by tag.</p>
			<TagItemContext.Provider value={{
				crossButtonPress: (tag: TagDefinition) => dispatch(removeTagDefinition(tag.id)),
				tagButtonPress: (tag: TagDefinition) => {
					if (selectedTag == tag.id) {
						setSelectedTag(null);
						navigate(".");
						return;
					}

					setSelectedTag(tag.id);

					navigate(".");

					// Completely reset the form with updated values.
					setTimeout(() => navigate(`edit/${tag.id}`), 1);
				}
			}}>
				{tagDefinitions.length > 0 ?
					<ul className="tag-list">
						{tagDefinitions.map(x => <TagItem key={x.id} tagDefinition={x} selected={selectedTag == x.id ? true : undefined}/>)}
					</ul>
					: <span className="empty-tag-message">Nothing to show...</span>
				}
			</TagItemContext.Provider>
			<hr className="regular-separator"/>
			<div className="tag-button-bar">
				<button className="button-small" onClick={() => dispatch(addTagDefinition({
					id: uuid(),
					name: resolveNewTag(tagDefinitions),
					colour: "10"
				}))}>Create tag</button>
			</div>
			<Outlet/>
		</>
	);
}
