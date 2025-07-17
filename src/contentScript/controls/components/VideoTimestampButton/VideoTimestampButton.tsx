import { useDispatch, useSelector } from "react-redux";
import { createTimestamp, IVideo, TimestampID } from "../../../../lib/video/video";
import { CircularLargeButton } from "../CircularLargeButton/CircularLargeButton";
import { videoActions } from "../../../../features/video/videoSlice";
import { directoryActions } from "../../../../features/directory/directorySlice";
import { RootState } from "../../../../app/store";
import { Keys, useHotkeys } from "react-hotkeys-hook";
import { getNodeFromPath } from "../../../../lib/directory/directory";
import { filterDirectoryName, NodePath, parsePath, validateDirectoryName } from "../../../../lib/directory/path";
import { useVideoCache } from "../../../../components/features/useVideoInfo";
import { YOUTUBE_EXTRACT_VIDEO_ID_REGEX } from "../../../../lib/util/youtube/youtubeUtil";

export function VideoTimestampButton() {
	const dispatch = useDispatch();
	const { retrieveInfo } = useVideoCache(); 
	const videoCache = useSelector((state: RootState) => state.cache.videoCache);
	const tree = useSelector((state: RootState) => state.directory.videoBrowser);
	const videos = useSelector((state: RootState) => state.video.videos);
	const { useAutoSaveLatestTimestamp, saveVideoTimestampButtonEnabled, pinCurrentTimestampShortcut, saveToChannelDirectory } = useSelector((state: RootState) => state.settings.settings);

	const onSaveVideo = async () => {
		let result = YOUTUBE_EXTRACT_VIDEO_ID_REGEX.exec(window.location.href);
		
		if (result == null || result.groups == undefined) {
			return;
		}

		let videoID = result.groups["VideoID"] as string;
		let video = document.querySelector("video") as HTMLVideoElement;
	
		let existingVideo = videos[videoID] as IVideo;
	
		let newTimestamp = {
			id: createTimestamp(), 
			time: Math.round(video.currentTime),
			message: "Saved timestamp.",
		}

		let updatedVideo: IVideo;
	
		if (existingVideo == null) {
			updatedVideo = {
				id: videoID,
				timestamps: [ newTimestamp ],
				autoplayTimestamp: useAutoSaveLatestTimestamp ? newTimestamp.id : null
			}
			
			let path: NodePath;

			if (saveToChannelDirectory) {
				let info = await retrieveInfo(videoID);

				if (info == undefined) {
					return;
				}

				let filtered = filterDirectoryName(info?.author_name);

				if (!filtered.success || validateDirectoryName(filtered.result) != null) {
					return;
				}

				path = parsePath(`$ > ${filtered.result}`);

				if (getNodeFromPath(tree, path) == null) {
					dispatch(directoryActions.createDirectoryNode({ parentPath: "$", slice: filtered.result }));
				}
			}
			else {
				path = parsePath("$");
			}

			// TODO: Selection menu.
			dispatch(directoryActions.createVideoNode({
				parentPath: path,
				videoID,
				videoData: videoCache
			}));
		}
		else {
			let autoplayTimestamp: TimestampID | null = null;

			if (existingVideo.autoplayTimestamp != null) {
				autoplayTimestamp = existingVideo.autoplayTimestamp;
			}
			else if (useAutoSaveLatestTimestamp) {
				autoplayTimestamp = newTimestamp.id;
			}

			updatedVideo = {
				...existingVideo,
				timestamps: [
					...existingVideo.timestamps,
					newTimestamp
				],
				autoplayTimestamp: autoplayTimestamp
			};
		}

		dispatch(videoActions.addOrReplaceVideo(updatedVideo));
	};

	useHotkeys(pinCurrentTimestampShortcut as Keys, onSaveVideo);

	if (!saveVideoTimestampButtonEnabled) {
		return <></>;
	}

	let logoUrl = chrome.runtime.getURL("/assets/logo/logo.svg");

	return (
		<CircularLargeButton onClick={onSaveVideo}>
			<img src={logoUrl}/>
		</CircularLargeButton>
	);
}
