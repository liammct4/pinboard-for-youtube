import { useMemo } from "react";
import { usePageLink } from "./usePageLink";

let extractIDRegex = /watch\?v=(?<videoID>.{11})/;

export type VideoData = {
	videoID: string;
	paused: boolean;
	currentTime: number;
	length: number;
}

type VideoExists = { isVideoPage: true, data: VideoData };
type VideoDoesntExist = { isVideoPage: false };

export function useLocalVideoData(): VideoExists | VideoDoesntExist {
	const pageLink = usePageLink();
	const videoPageResult = useMemo((): VideoExists | VideoDoesntExist => {
		let result = extractIDRegex.exec(pageLink);

		if (result == null) {
			return { isVideoPage: false };
		}
		
		if (result.groups == undefined) {
			return { isVideoPage: false };
		}

		let video = document.querySelector("video") as HTMLVideoElement;

		return {
			isVideoPage: true,
			data: {
				videoID: result.groups["videoID"],
				paused: video.paused,
				currentTime: video.currentTime,
				length: video.duration
			}
		};
	}, [pageLink]);

	return videoPageResult;
}
