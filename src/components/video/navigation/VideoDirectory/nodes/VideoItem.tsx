import { useContext, useRef } from "react";
import { IVideo, Timestamp } from "../../../../../lib/video/video";
import { CompactVideoItem } from "../../../styledVideoItems/CompactVideoItem/CompactVideoItem";
import { MinimalVideoItem } from "../../../styledVideoItems/MinimalVideoItem/MinimalVideoItem";
import { RegularVideoItem } from "../../../styledVideoItems/RegularVideoItem/RegularVideoItem";
import { VideoItemContext } from "../../../styledVideoItems/VideoItem";
import { IVideoDirectoryPresentationContext, VideoDirectoryPresentationContext } from "../VideoDirectory";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import { tempStateActions } from "../../../../../features/state/tempStateSlice";
import { videoActions } from "../../../../../features/video/videoSlice";
import { IVideoNode } from "../../../../../lib/directory/directory";
import { IVideoDirectoryInteractionContext, VideoDirectoryInteractionContext } from "../../../../../context/directory";

interface IVideoItemProperties {
	node: IVideoNode;
}

export function VideoItem({ node }: IVideoItemProperties): React.ReactNode {
	const { videoItemStyle } = useContext<IVideoDirectoryPresentationContext>(VideoDirectoryPresentationContext);
	const { selectedItems, setSelectedItems } = useContext<IVideoDirectoryInteractionContext>(VideoDirectoryInteractionContext);
	const isExpanded = useSelector((state: RootState) => state.tempState.expandedVideoIDs).includes(node.videoID);
	const dispatch = useDispatch();

	// 'videos = useSelector(...)' will not update in closure (onTimestampAdded etc) for some reason so this is necessary.
	const videos = useSelector((state: RootState) => state.video.videos);
	const videosRef = useRef(videos);

	videosRef.current = videos;

	const onTimestampChanged = (oldTimestamp: Timestamp, newTimestamp: Timestamp | null, autoplay: boolean) => {
		let copyVideo = videosRef.current[node.videoID] as IVideo;
		let newVideo: IVideo = { ...copyVideo, timestamps: [ ...copyVideo.timestamps ] };
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
			
			if (autoplay) {
				newVideo.autoplayTimestamp = newTimestamp.id;
			}
			else if (!autoplay && newVideo.autoplayTimestamp == newTimestamp.id) {
				newVideo.autoplayTimestamp = null;
			}
		}

		dispatch(videoActions.addOrReplaceVideo(newVideo));
	};

	const onTimestampAdded = (newTimestamp: Timestamp) => {
		let copyVideo = videosRef.current[node.videoID] as IVideo;
		let newVideo: IVideo = {
			...copyVideo,
			timestamps: [
				...copyVideo.timestamps,
				newTimestamp
			]
		};
		
		dispatch(videoActions.addOrReplaceVideo(newVideo));
	};

	const setTimestamps = (timestamps: Timestamp[]) => {
		let copyVideo = videosRef.current[node.videoID] as IVideo;
		let newVideo = { ...copyVideo, timestamps: timestamps };

		dispatch(videoActions.addOrReplaceVideo(newVideo));
	};

	const onExpanded = (expanded: boolean) => {
		if (expanded) {
			dispatch(tempStateActions.expandVideo(node.videoID));
			return;
		}

		dispatch(tempStateActions.collapseVideo(node.videoID));
	}

	let video = videos[node.videoID];
	
	if (video == undefined) {
		console.error(`Could not retrive video ID. Video ID of ${node.videoID} exists but no matching video was found.`);
		return <p>ERROR</p>;
	}

	return (
		<div data-focus tabIndex={0} onMouseDown={(e) => {
			if (e.ctrlKey) {
				if (selectedItems.includes(node.nodeID)) {
					setSelectedItems([ ...selectedItems ].filter(x => x != node.nodeID));
				}
				else {
					setSelectedItems([ ...selectedItems, node.nodeID])
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
