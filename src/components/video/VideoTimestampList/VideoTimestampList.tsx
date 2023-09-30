import { useContext } from "react";
import { useDispatch } from "react-redux"
import { VideoContext, VideoListContext } from "../../../context/video.ts";
import { Timestamp, Video, generateTimestamp } from "../../../lib/video/video.ts";
import { generateUniqueFrom } from "../../../lib/util/generic/randomUtil.ts";
import { Reorder, useDragControls } from "framer-motion";
import SubtleExpander from "../../presentation/SubtleExpander/SubtleExpander.js"
import VideoTimestamp from  "./../VideoTimestamp/VideoTimestamp.jsx"
import VideoCard from "./../VideoCard/VideoCard.jsx"
import { ReactComponent as PlusIcon } from "src/../assets/symbols/plus.svg"
import { ReactComponent as DragHandle } from "src/../assets/icons/drag_vrect.svg"
import { IconContainer } from "../../images/svgAsset.tsx";
import "./VideoTimestampList.css"

export function VideoTimestampList(): React.ReactNode {
	const dispatch = useDispatch();
	const topLevelVideos = useContext(VideoListContext);
	const video = useContext(VideoContext);
	let dragControls = useDragControls();

	const onChange = (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => {
		let videoTimestamps = topLevelVideos.videos.find(x => x.videoID == video.videoID)?.timestamps;
		let updatedTimestamps: Array<Timestamp> = [ ...videoTimestamps! ];

		if (newTimestamp == null) {
			// The timestamp has been deleted.
			let index = updatedTimestamps.findIndex(x => x.id == oldTimestamp.id);
			updatedTimestamps.splice(index, 1);
		}
		else {
			for (let i = 0; i < updatedTimestamps.length; i++) {
				if (updatedTimestamps[i].id == oldTimestamp.id) {
					updatedTimestamps[i] = newTimestamp;
					break;
				}
			}
		}

		let updatedVideo: Video = {
			videoID: video.videoID,
			timestamps: updatedTimestamps,
			appliedTags: video.appliedTags
		}
		
		dispatch(topLevelVideos.actions.updateVideo(updatedVideo));
	}

	const onAddTimestamp: () => void = () => {
		let newTime = generateUniqueFrom(video.timestamps, (x) => x.time, 86400);
		let updatedVideo: Video = {
			videoID: video.videoID,
			timestamps: [
				...video.timestamps,
				generateTimestamp(newTime!, "New Timestamp")
			],
			appliedTags: video.appliedTags
		}
		
		dispatch(topLevelVideos.actions.updateVideo(updatedVideo));
	}

	const handleExpanded = (open: boolean) => {
		if (open) {
			dispatch(topLevelVideos.actions.addExpandedID(video.videoID));
			return;
		}

		dispatch(topLevelVideos.actions.removeExpandedID(video.videoID));
	}

	const handleTimestampReorder = (newTimestamps: Array<Timestamp>) => {
		let listener = (_event: any) => {
			document.removeEventListener("mouseup", listener);
			setTimeout(() => {
				let newVideo: Video = {
					...video,
					timestamps: newTimestamps
				}

				dispatch(topLevelVideos.actions.updateVideo(newVideo));
			}, 100);
		}

		document.addEventListener("mouseup", listener);
	};

	let isOpen = topLevelVideos.openVideos.includes(video.videoID);

	return (
		<Reorder.Item value={video} dragListener={false} dragControls={dragControls} id={video.videoID}>
			<div className="video-list-outer">
				<div className="video-card">
					<VideoCard videoID={video.videoID}/>
					<div className="drag-handle" onPointerDown={(e) => dragControls.start(e)}>
						<IconContainer
							className="icon-colour-standard drag-handle"
							asset={DragHandle}
							use-fill/>
					</div>
				</div>
				<hr className="regular-separator"></hr>
				<SubtleExpander expanded={isOpen} onExpanded={handleExpanded} openMessage="Close timestamps" closeMessage="Expand timestamps">	
					<Reorder.Group className="timestamp-list" values={video.timestamps} onReorder={handleTimestampReorder}>
						{video.timestamps.map((x) => 
							<VideoTimestamp key={x.id} videoID={video.videoID} timestamp={x} onChange={onChange}></VideoTimestamp>)}
					</Reorder.Group>
					<div className="add-timestamp-row">
						<p className="fake-timestamp">00:00</p>
						<div style={{ flexGrow: "1" }}></div>
						<button
							className="add-timestamp-button circle-button"
							onClick={onAddTimestamp}>
							<IconContainer
								className="icon-colour-standard"
								asset={PlusIcon}
								use-stroke/>
						</button>
						<p className="info-text">Add new timestamp</p>
					</div>
				</SubtleExpander>
			</div>
			<hr className="bold-separator"></hr>
		</Reorder.Item>
	)
}

export default VideoTimestampList;
