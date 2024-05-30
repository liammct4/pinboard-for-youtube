import { useEffect, useState } from "react";
import * as YTUtil from "./../../../lib/util/youtube/youtubeUtil.ts"
import { ReactComponent as ThumbnailMissingImage } from "./../../../../assets/thumb_missing.svg"
import "./VideoCard.css"

export interface IVideoCardProperties {
	className?: string;
	videoID: string | undefined;
	placeholderTitle?: string;
}

export function VideoCard({ className = "", videoID, placeholderTitle = "" }: IVideoCardProperties): React.ReactNode {
	const [videoExists, setVideoExists] = useState<boolean>(false);
	const [url, setUrl] = useState<string | null>(null);
	const [info, setInfo] = useState<any | null>(null);

	useEffect(() => {
		const getVideoInfo = async () => {
			if (videoID != undefined && YTUtil.videoExists(YTUtil.getYouTubeLinkFromVideoID(videoID))) {
				setUrl(YTUtil.getYouTubeLinkFromVideoID(videoID));
				setInfo(await YTUtil.getYoutubeVideoInfoFromVideoID(videoID));

				setVideoExists(true);
			}
		}

		getVideoInfo();
	}, [])

	return (
		<div className={`video-card-box ${className.trim()}`}>
			{videoExists ? 
				<>
					<img className="thumbnail-image" src={`https://img.youtube.com/vi/${videoID}/default.jpg`} alt={`The thumbnail for the video titled '${info["title"]}'.`}/>
					<h2 className="video-title">{info["title"]}</h2>
					<a className="link-text video-link" href={url!}>{url}</a>
				</>
				:
				<>
					<ThumbnailMissingImage className="thumbnail-image" preserveAspectRatio="none" width={undefined} height={undefined}/>
					<h2 className="video-title">{placeholderTitle}</h2>
				</>
			}
		</div>
	)
}
