import { useEffect, useState } from "react";
import { usePageLink } from "./usePageLink";

let extractIDRegex = /watch\?v=(?<videoID>.{11})/;

export type VideoData = {
	videoID: string;
	paused: boolean;
	currentTime: number;
	length: number;
}

type VideoExists = { isVideoPage: true, isAdvertisement: boolean, data: VideoData };
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
	let adContainer = document.querySelector(".video-ads.ytp-ad-module") as HTMLDivElement

	return {
		isVideoPage: true,
		isAdvertisement: adContainer.hasChildNodes(),
		data: {
			videoID: result.groups["videoID"],
			paused: video.paused,
			currentTime: video.currentTime,
			length: video.duration
		}
	};
}

export function useLocalVideoData(): VideoExists | VideoDoesntExist {
	const pageLink = usePageLink();
	const [ videoResult, setVideoResult ] = useState<VideoExists | VideoDoesntExist>(recalculateVideoData(pageLink));

	useEffect(() => {
		const check = () => {
			let result = recalculateVideoData(window.location.href);

			setVideoResult(result);
			setTimeout(check, 100);
		}

		check();
	}, []);

	return videoResult;
}
