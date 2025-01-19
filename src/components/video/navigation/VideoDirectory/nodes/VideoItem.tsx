import { useContext } from "react";
import { IVideo, Timestamp } from "../../../../../lib/video/video";
import { CompactVideoItem } from "../../../styledVideoItems/CompactVideoItem/CompactVideoItem";
import { MinimalVideoItem } from "../../../styledVideoItems/MinimalVideoItem/MinimalVideoItem";
import { RegularVideoItem } from "../../../styledVideoItems/RegularVideoItem/RegularVideoItem";
import { VideoItemContext } from "../../../styledVideoItems/VideoItem";
import { IVideoNode } from "../../directory";
import { IVideoDirectoryPresentationContext, VideoDirectoryPresentationContext } from "../VideoDirectory";
import { useVideoStateAccess } from "../../../../features/useVideoStateAccess";

interface IVideoItemProperties {
	node: IVideoNode;
}

export function VideoItem({ node }: IVideoItemProperties): React.ReactNode {
	const { videoItemStyle } = useContext<IVideoDirectoryPresentationContext>(VideoDirectoryPresentationContext);
	const { videoData, updateVideo } = useVideoStateAccess();

	if (!videoData.has(node.videoID)) {
		console.error(`Could not retrive video ID. Video ID of ${node.videoID} exists but no matching video was found.`);
		return <p>ERROR</p>;
	}

	let video = videoData.get(node.videoID) as IVideo;

	const onTimestampChanged = (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => {
		let newVideo = { ...video };
		let index = newVideo.timestamps.findIndex(x => x.id == oldTimestamp.id);

		if (index == -1) {
			console.error("Timestamp doesn't exist.");
			return;
		}

		if (newTimestamp == null) {
			newVideo.timestamps.splice(index, 1);
		}
		else {
			newVideo.timestamps[index] = newTimestamp;
		}

		updateVideo(newVideo);
	};

	const onTimestampAdded = (newTimestamp: Timestamp) => {
		let newVideo = { ...video };

		newVideo.timestamps.push(newTimestamp);

		updateVideo(newVideo);
	};

	const setTimestamps = (timestamps: Timestamp[]) => {
		let newVideo = { ...video, timestamps: timestamps };

		updateVideo(newVideo);
	};

	let styleItem;

	switch (videoItemStyle) {
		case "COMPACT":
			styleItem = <CompactVideoItem />;
			break;
		case "MINIMAL":
			styleItem = <MinimalVideoItem />;
			break;
		case "REGULAR":
			styleItem = <RegularVideoItem />;
			break;
	}

	return (
		<VideoItemContext.Provider value={{
			video,
			onTimestampAdded,
			onTimestampChanged,
			setTimestamps
		}}>
			{styleItem}
		</VideoItemContext.Provider>
	);
}
