import { useContext } from "react";
import { IVideo, Timestamp } from "../../../../../lib/video/video";
import { CompactVideoItem } from "../../../styledVideoItems/CompactVideoItem/CompactVideoItem";
import { MinimalVideoItem } from "../../../styledVideoItems/MinimalVideoItem/MinimalVideoItem";
import { RegularVideoItem } from "../../../styledVideoItems/RegularVideoItem/RegularVideoItem";
import { VideoItemContext } from "../../../styledVideoItems/VideoItem";
import { getSectionPrefix, IVideoDirectoryInteractionContext, IVideoNode, VideoDirectoryInteractionContext } from "../../directory";
import { IVideoDirectoryPresentationContext, VideoDirectoryPresentationContext } from "../VideoDirectory";
import { useVideoStateAccess } from "../../../../features/useVideoStateAccess";
import { useUserAccount } from "../../../../features/useUserAccount";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import { addExpandedID, removeExpandedID } from "../../../../../features/state/tempStateSlice";

interface IVideoItemProperties {
	node: IVideoNode;
}

export function VideoItem({ node }: IVideoItemProperties): React.ReactNode {
	const { videoItemStyle } = useContext<IVideoDirectoryPresentationContext>(VideoDirectoryPresentationContext);
	const { selectedItems, setSelectedItems } = useContext<IVideoDirectoryInteractionContext>(VideoDirectoryInteractionContext);
	const { isSignedIn, user } = useUserAccount();
	const { videoData, directoryUpdateVideo: updateVideo } = useVideoStateAccess(isSignedIn ? user : null);
	const isExpanded = useSelector((state: RootState) => state.tempState.expandedVideoIDs).includes(node.videoID);
	const dispatch = useDispatch();

	if (!videoData.has(node.videoID)) {
		console.error(`Could not retrive video ID. Video ID of ${node.videoID} exists but no matching video was found.`);
		return <p>ERROR</p>;
	}
	
	let video = videoData.get(node.videoID) as IVideo;

	const onTimestampChanged = (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => {
		let newVideo = { ...videoData.get(node.videoID)! };
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

	const onExpanded = (expanded: boolean) => {
		if (expanded) {
			dispatch(addExpandedID(video.id));
			return;
		}

		dispatch(removeExpandedID(video.id));
	}


	return (
		<div onMouseDown={(e) => {
			let section = getSectionPrefix(node);

			if (e.ctrlKey) {
				if (selectedItems.includes(section)) {
					setSelectedItems([ ...selectedItems ].filter(x => x != section));
				}
				else {
					setSelectedItems([ ...selectedItems, section])
				}
			}
		}}>
			<VideoItemContext.Provider value={{
				video,
				onTimestampAdded,
				onTimestampChanged,
				setTimestamps,
				expanded: isExpanded,
				setExpanded: onExpanded
			}}>
				{
					videoItemStyle == "MINIMAL" ? <MinimalVideoItem/> :
					videoItemStyle == "COMPACT" ? <CompactVideoItem/> :
					videoItemStyle == "REGULAR" ? <RegularVideoItem/> : <></>
				}
			</VideoItemContext.Provider>
		</div>
	);
}
