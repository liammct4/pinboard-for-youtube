import { useEffect, useState } from "react";
import { doesVideoExist, getYouTubeLinkFromVideoID, getYoutubeVideoInfoFromVideoID } from "../../lib/util/youtube/youtubeUtil";

export function useVideoInfo(videoID: string | undefined) {
	const [videoExists, setVideoExists] = useState<boolean>(false);
	const [url, setUrl] = useState<string | null>(null);
	const [info, setInfo] = useState<any | null>(null);

	useEffect(() => {
		const getVideoInfo = async () => {
			if (videoID != undefined && doesVideoExist(getYouTubeLinkFromVideoID(videoID))) {
				setUrl(getYouTubeLinkFromVideoID(videoID));
				setInfo(await getYoutubeVideoInfoFromVideoID(videoID));

				setVideoExists(true);
			}
		}

		getVideoInfo();
	}, []);

	return { videoExists, url, info };
}
