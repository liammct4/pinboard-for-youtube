import { useVideoInfo } from "../../features/useVideoInfo";
import { ReactComponent as ThumbnailMissingImage } from "./../../../../assets/thumb_missing.svg"

import "./VideoThumbnail.css"

export interface IVideoThumbnailProperties {
	videoID: string;
	alt: string;
}

export function VideoThumbnail({ videoID, alt }: IVideoThumbnailProperties): React.ReactNode {
	const { videoExists } = useVideoInfo(videoID);

	if (videoExists) {
		return <img
			className="thumbnail-image"
			src={`https://img.youtube.com/vi/${videoID}/default.jpg`}
			alt={alt}
			/>
	}
	else {
		return <ThumbnailMissingImage className="thumbnail-image" preserveAspectRatio="none" width={undefined} height={undefined}/>;
	}
}
