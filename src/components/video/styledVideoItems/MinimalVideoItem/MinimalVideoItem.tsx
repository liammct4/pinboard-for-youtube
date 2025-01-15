import { useContext } from "react";
import { IVideoItemContext, VideoItemContext } from "../VideoItem";

export function MinimalVideoItem(): React.ReactNode {
	const { video, onTimestampAdded, onTimestampChanged } = useContext<IVideoItemContext>(VideoItemContext);

	return (
		<p>Minimal Video Style</p>
	);
}
