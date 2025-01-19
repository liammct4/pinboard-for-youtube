import { useVideoInfo } from "../../features/useVideoInfo";
import { ReactComponent as ThumbnailMissingImage } from "./../../../../assets/thumb_missing.svg"

import "./VideoThumbnail.css"

export interface IVideoThumbnailProperties {
	videoID: string;
	width?: number;
	alt: string;
}

export function VideoThumbnail({ videoID, alt, width }: IVideoThumbnailProperties): React.ReactNode {
	const { videoExists } = useVideoInfo(videoID);

	if (videoExists) {
		return <img
			className="thumbnail-image"
			style={{ width: `${width ?? 80}px` }}
			src={`https://img.youtube.com/vi/${videoID}/default.jpg`}
			alt={alt}
			/>
	}
	else {
		return <ThumbnailMissingImage className="thumbnail-image" preserveAspectRatio="none" width={undefined} height={undefined}/>;
	}
}
