import { createContext, useEffect, useRef, useState } from "react";
import { IWrapperProperties } from "../../components/features/wrapper";
import { areObjectsEqual } from "../../lib/util/objects/objects";
import { usePageLink } from "./usePageLink";

export let extractIDRegex = /watch\?v=(?<videoID>.{11})/;

export type VideoData = {
	videoID: string;
	paused: boolean;
	currentTime: number;
	length: number;
}

type VideoExists = { isVideoPage: true, isLivestream: boolean, isAdvertisement: boolean, data: VideoData };
type VideoDoesntExist = { isVideoPage: false };

function recalculateVideoData(pageLink: string): VideoExists | VideoDoesntExist {
	let result = extractIDRegex.exec(pageLink);

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
			videoID: result.groups["videoID"],
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

	useEffect(() => {
		const check = () => {
			let result = recalculateVideoData(window.location.href);

			if (!areObjectsEqual(result, videoResult)) {
				setVideoResult(result);
			}
			else {
				setTimeout(check, 100);
			}
		}
		
		check();
	}, [pageLink, videoResult]);

	useEffect(() => {
		if (videoResult.isVideoPage && videoResult.isLivestream) {
			if (video.current == null) {
				video.current = document.querySelector("video");
			}

			const update = () => {
				if (Math.round(video.current!.duration) != videoResult.data.length) {
					let result: VideoExists = {
						...videoResult,
						data: {
							...videoResult.data,
							length: Math.round(video.current!.duration)
						}
					}

					setVideoResult(result);
				}

				setTimeout(() => update(), 900);
			}

			setTimeout(() => update(), 900);
		}
	}, [ videoResult ]);
	
	return (
		<LocalVideoDataContext.Provider value={videoResult}>
			{children}
		</LocalVideoDataContext.Provider>
	);
}

export const LocalVideoDataContext = createContext<VideoExists | VideoDoesntExist>({ isVideoPage: false });
