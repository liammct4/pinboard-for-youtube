import { useContext } from "react";
import { IVideoItemContext, VideoItemContext } from "../VideoItem";

export function RegularVideoItem(): React.ReactNode {
	const { video, onTimestampAdded, onTimestampChanged } = useContext<IVideoItemContext>(VideoItemContext);

	return (
		<p>Regular Video Style</p>
	)
}
