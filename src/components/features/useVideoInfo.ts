import { useEffect, useState } from "react";
import { getYoutubeVideoInfoFromVideoID, IYoutubeVideoInfo } from "../../lib/util/youtube/youtubeUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { cacheActions } from "../../features/cache/cacheSlice";

export function useVideoCache() {
	const cache = useSelector((state: RootState) => state.cache.videoCache);
	const dispatch = useDispatch();

	const retrieveInfo = async (videoID: string): Promise<IYoutubeVideoInfo | undefined> => {
		let existingCached = cache.find(x => x.video_id == videoID);

		if (existingCached != undefined) {
			return existingCached;
		}

		let info = await getYoutubeVideoInfoFromVideoID(videoID);

		if (!info.success || info.result == undefined) {
			return undefined;
		}


		dispatch(cacheActions.saveVideoToCache(info.result));

		return info.result;
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
	
				if (!info.success || info.result == undefined) {
					return;
				}
	
				setVideo(info.result);
				setVideoExists(true);
	
				dispatch(cacheActions.saveVideoToCache(info.result));
			}

			getVideoInfo();
		}
	}, []);

	return { videoExists, video };
}
