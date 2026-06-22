import { createContext, useEffect, useRef, useState } from "react";
import { IWrapperProperties } from "../../components/features/wrapper";
import { areObjectsEqual } from "../../lib/util/objects/objects";
import { usePageLink } from "./usePageLink";
import { YOUTUBE_EXTRACT_VIDEO_ID_REGEX } from "../../lib/util/youtube/youtubeUtil";

export type VideoData = {
	videoID: string;
	paused: boolean;
	currentTime: number;
	length: number;
}

type VideoExists = { isVideoPage: true, isLivestream: boolean, isAdvertisement: boolean, data: VideoData };
type VideoDoesntExist = { isVideoPage: false };

function recalculateVideoData(pageLink: string): VideoExists | VideoDoesntExist {
	let result = YOUTUBE_EXTRACT_VIDEO_ID_REGEX.exec(pageLink);

	if (result == null) {
		return { isVideoPage: false };
	}
	
	if (result.groups == undefined) {
		return { isVideoPage: false };
	}

	let video = document.querySelector("video") as HTMLVideoElement;
	let adContainer = document.querySelector(".video-ads.ytp-ad-module") as HTMLDivElement;
	let isLive = document.querySelector(".ytp-live") != null;

	return {
		isVideoPage: true,
		isAdvertisement: adContainer != null && adContainer.hasChildNodes(),
		isLivestream: isLive,
		data: {
			videoID: result.groups["VideoID"],
			paused: video.paused,
			currentTime: video.currentTime,
			length: Math.round(video.duration)
		}
	};
}

export function LocalVideoDataWrapper({ children }: IWrapperProperties) {
	const pageLink = usePageLink();
	const video = useRef<HTMLVideoElement | null>(null!);
	const [ videoResult, setVideoResult ] = useState<VideoExists | VideoDoesntExist>(recalculateVideoData(pageLink));
	const videoResultRef = useRef(videoResult);

	useEffect(() => {
		videoResultRef.current = videoResult;
	}, [videoResult]);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		const check = () => {
			let result = recalculateVideoData(window.location.href);

			if (!areObjectsEqual(result, videoResultRef.current)) {
				setVideoResult(result);
			}

			timeoutId = setTimeout(check, 100);
		}
		
		timeoutId = setTimeout(check, 100);

		return () => clearTimeout(timeoutId);
	}, [pageLink]);

	useEffect(() => {
		if (!videoResult.isVideoPage || !videoResult.isLivestream) {
			return;
		}

		if (video.current == null) {
			video.current = document.querySelector("video");
		}

		let timeoutId: ReturnType<typeof setTimeout>;

		const update = () => {
			const currentLength = Math.round(video.current!.duration);
			const currentData = videoResultRef.current as VideoExists;
			if (currentLength !== currentData.data.length) {
				let result: VideoExists = {
					...currentData,
					data: {
						...currentData.data,
						length: currentLength
					}
				}

				setVideoResult(result);
			}

			timeoutId = setTimeout(update, 900);
		}

		timeoutId = setTimeout(update, 900);

		return () => clearTimeout(timeoutId);
	}, [videoResult.isVideoPage, videoResult.isVideoPage && videoResult.isLivestream]);
	
	return (
		<LocalVideoDataContext.Provider value={videoResult}>
			{children}
		</LocalVideoDataContext.Provider>
	);
}

export const LocalVideoDataContext = createContext<VideoExists | VideoDoesntExist>({ isVideoPage: false });
