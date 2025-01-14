import { useVideoInfo } from "../../../features/useVideoInfo";
import { IVideoItemProperties } from "../VideoItem";

export function CompactVideoItem({ video }: IVideoItemProperties): React.ReactNode {
	const { video: videoInfo } = useVideoInfo(video.id);

	return (
		<>
			<span className="video-title">
				{videoInfo?.title}
			</span>
		</>
	);
}
