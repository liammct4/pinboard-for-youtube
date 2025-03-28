/// <reference types="vite-plugin-svgr/client" />

import { useVideoInfo } from "../../features/useVideoInfo";
import ThumbnailMissingImage from "./../../../../assets/thumb_missing.svg?react"

import "./VideoThumbnail.css"

export interface IVideoThumbnailProperties {
	className?: string;
	videoID: string;
	width?: number;
	alt: string;
}

export function VideoThumbnail({ className, videoID, alt, width }: IVideoThumbnailProperties): React.ReactNode {
	const { videoExists } = useVideoInfo(videoID);

	let widthPx = `${width ?? 80}px`;

	if (videoExists) {
		return <img
			className={`thumbnail-image ${className}`}
			style={{ width: widthPx }}
			src={`https://img.youtube.com/vi/${videoID}/default.jpg`}
			alt={alt}
			/>
	}
	else {
		return <ThumbnailMissingImage className={`thumbnail-image ${className}`} preserveAspectRatio="none" width={width} height={undefined}/>;
	}
}
