import { useEffect, useState } from "react";
import { doesVideoExist, getVideoIdFromYouTubeLink, getYouTubeLinkFromVideoID, getYoutubeVideoInfoFromLink, getYoutubeVideoInfoFromVideoID, IYoutubeVideoInfo } from "../../lib/util/youtube/youtubeUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { saveVideoToCache } from "../../features/cache/cacheSlice";

export function useVideoInfo(videoID: string | undefined) {
	const cache = useSelector((state: RootState) => state.cache.videoCache);
	const [ contacted, setContacted ] = useState<boolean>();
	const [ video, setVideo ] = useState<IYoutubeVideoInfo>();
	const [ videoExists, setVideoExists ] = useState<boolean>(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const getVideoInfo = async () => {
			if (videoID == undefined) {
				return;
			}

			let index = cache.findIndex(x => x.video_id == videoID);

			if (index != -1) {
				setVideo(cache[index]);
				setVideoExists(true);
			}
			else {
				let info = await getYoutubeVideoInfoFromVideoID(videoID);
	
				if (info == undefined) {
					return;
				}
	
				setVideo(info);
				setVideoExists(true);

				dispatch(saveVideoToCache(info));
			}
		}

		setTimeout(getVideoInfo, 200);
	}, []);

	return { videoExists, video };
}
