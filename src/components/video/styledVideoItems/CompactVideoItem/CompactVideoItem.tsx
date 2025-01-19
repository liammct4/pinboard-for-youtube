import { useContext } from "react";
import { IVideoItemContext, VideoItemContext } from "../VideoItem";

export function CompactVideoItem(): React.ReactNode {
	const { video, onTimestampAdded, onTimestampChanged } = useContext<IVideoItemContext>(VideoItemContext);

	return (
		<p>Compact Video Style</p>
	);
}
