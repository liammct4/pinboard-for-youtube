import { useEffect, useState } from "react";
import { doesVideoExist, getVideoIdFromYouTubeLink, getYouTubeLinkFromVideoID, getYoutubeVideoInfoFromLink, getYoutubeVideoInfoFromVideoID, IYoutubeVideoInfo } from "../../lib/util/youtube/youtubeUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { saveVideoToCache } from "../../features/cache/cacheSlice";
import { useLocalStorage } from "./storage/useLocalStorage";

export function useVideoCache() {
	const { storage, setStorage } = useLocalStorage();
	const cache = storage.cache.videos;

	const retrieveInfo = async (videoID: string): Promise<IYoutubeVideoInfo | undefined> => {
		let index = cache.findIndex(x => x.video_id == videoID);

		if (index != -1) {
			return cache[index];
		}

		let info = await getYoutubeVideoInfoFromVideoID(videoID);

		if (info == undefined) {
			return undefined;
		}

		storage.cache.videos.push(info);
		setStorage(storage);

		return info;
	}

	return { retrieveInfo };
}

export function useVideoInfo(videoID: string | undefined) {
	const cache = useSelector((state: RootState) => state.cache.videoCache);
	const [ video, setVideo ] = useState<IYoutubeVideoInfo>();
	const [ videoExists, setVideoExists ] = useState<boolean>(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (videoID == undefined) {
			return;
		}

		let index = cache.findIndex(x => x.video_id == videoID);

		if (index != -1) {
			setVideo(cache[index]);
			setVideoExists(true);
		}
		else {
			const getVideoInfo = async () => {
				let info = await getYoutubeVideoInfoFromVideoID(videoID);
	
				if (info == undefined) {
					return;
				}
	
				setVideo(info);
				setVideoExists(true);
	
				dispatch(saveVideoToCache(info));
			}

			getVideoInfo();
		}
	}, []);

	return { videoExists, video };
}
