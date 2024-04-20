import { useContext, useMemo } from "react";
import { useDispatch } from "react-redux"
import { VideoContext, VideoListContext } from "../../../context/video.ts";
import { Timestamp, Video, generateTimestamp } from "../../../lib/video/video.ts";
import { generateUniqueFrom } from "../../../lib/util/generic/randomUtil.ts";
import { Reorder, useDragControls } from "framer-motion";
import { LabeledArrowExpander } from "../../presentation/LabeledArrowExpander/LabeledArrowExpander.js"
import VideoTimestamp from  "./../VideoTimestamp/VideoTimestamp.jsx"
import VideoCard from "./../VideoCard/VideoCard.jsx"
import { ReactComponent as PlusIcon } from "src/../assets/symbols/plus.svg"
import { ReactComponent as DragHandle } from "src/../assets/icons/drag_vrect.svg"
import { ReactComponent as CrossIcon } from "src/../assets/symbols/cross.svg"
import { IconContainer } from "../../images/svgAsset.tsx";
import { TagItem } from "../tags/TagItem/TagItem.tsx";
import { TagItemContext } from "../../../context/tag.ts";
import * as Select from "@radix-ui/react-select"
import { updateVideo } from "../../../features/videos/videoSlice.ts";
import { SelectItem } from "../../input/DropdownInput/dropdown.tsx";
import "./../../../styling/elements/select.css"
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
	// Removes tags which have already been applied.
	const applicableTags = useMemo(() =>
		topLevelVideos
		.tagDefinitions
		.filter(x => video.appliedTags.find(y => y == x.id) == undefined)
	, [topLevelVideos.tagDefinitions, video.appliedTags]);

	// Handles delete mode.
	const onVideoClicked = () => {
		if (topLevelVideos.deleteMode) {
			dispatch(topLevelVideos.actions.removeVideo(video.videoID));
		}
	}

	let isOpen = topLevelVideos.openVideos.includes(video.videoID);

	return (
		<Reorder.Item value={video} dragListener={false} dragControls={dragControls} id={video.videoID}>
			<div className="video-list-outer" onClick={onVideoClicked} data-is-delete={topLevelVideos.deleteMode}>
				{/* The delete/cross image when hovering. */}
				<IconContainer className="icon-colour-standard delete-image" asset={CrossIcon} use-stroke/>
				<div className="video-list-inner" data-is-delete={topLevelVideos.deleteMode}>
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
					<div className="video-details-expander">
						<LabeledArrowExpander expanded={isOpen} onExpanded={handleExpanded} openMessage="Close timestamps" closeMessage="Expand timestamps">	
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
						</LabeledArrowExpander>
						<ul className="applied-tag-list">
							<TagItemContext.Provider value={{
								tagButtonPress: () => null,
								crossButtonPress: (tag) => {
									let index = video.appliedTags.findIndex(x => x == tag.id);

									if (index == -1) {
										return;
									}

									let updatedVideo: Video = {
										...video,
										appliedTags: [ ...video.appliedTags ]
									}

									updatedVideo.appliedTags.splice(index);

									dispatch(updateVideo(updatedVideo));
								}
							}}>
								{video.appliedTags.map(x => 
									<li key={x}>
										<TagItem tagDefinition={topLevelVideos.tagDefinitions.find(y => y.id == x)!}/>
									</li>)}
							</TagItemContext.Provider>
							<li>
								<Select.Root
									value=""
									onValueChange={(value) => {
										let updatedVideo: Video = {
											...video,
											appliedTags: [
												...video.appliedTags,
												value
											]
										}

										dispatch(updateVideo(updatedVideo));
									}}> 
									<Select.Trigger className="select-button field-input circle-button add-tag-dropdown-button" aria-label="Theme" disabled={applicableTags.length == 0}>
										<div className="value-outer" >
											<Select.Value/>
										</div>
										<Select.Icon className="open-icon">
											<IconContainer
												className="icon-colour-standard"
												asset={PlusIcon}
												use-stroke
											/>
										</Select.Icon>
									</Select.Trigger>
									<Select.Portal>
										<Select.Content className="select-dropdown-content">
											<Select.Viewport className="select-viewport">
												<Select.Group className="select-group">
													{applicableTags.map(x => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}
												</Select.Group>
											</Select.Viewport>
										</Select.Content>
									</Select.Portal>
								</Select.Root>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<hr className="bold-separator"></hr>
		</Reorder.Item>
	)
}

export default VideoTimestampList;
