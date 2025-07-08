import { useContext, useState } from "react";
import { DragListEvent, DragList } from "../../../interactive/DragList/DragList";
import { DragListItem } from "../../../interactive/DragList/DragListItem";
import { Timestamp } from "../../../../lib/video/video";
import { VideoTimestamp } from "../VideoTimestamp/VideoTimestamp";
import "./TimestampList.css"
import { TimestampListStateContext } from "../../navigation/VideoDirectoryBrowser/VideoDirectoryBrowser";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { videoActions } from "../../../../features/video/videoSlice";

export interface ITimestampListProperties {
	videoID: string;
	timestamps: Timestamp[];
	onTimestampsChanged: (newTimestamps: Timestamp[]) => void;
	onTimestampChanged: (oldTimestamp: Timestamp, newTimestamp: Timestamp | null, autoplay: boolean) => void;
}

export function TimestampList({ timestamps, videoID, onTimestampsChanged, onTimestampChanged }: ITimestampListProperties): React.ReactNode {
	const [ dragging, setDragging ] = useState<DragListEvent<string> | null>(null);
	const [ isDragging, setIsDragging ] = useState<boolean>(false);
	const { setActivelyDragging } = useContext(TimestampListStateContext);
	const autoplayID = useSelector((state: RootState) => state.video.videos[videoID]!.autoplayTimestamp);
	const dispatch = useDispatch();

	// When dragging ends, reorder the list.
	const dragEnd = () => {
		setIsDragging(false);
		setDragging(null);
		setActivelyDragging(false);
		
		if (dragging == null || dragging.notInBounds) {
			return;
		}

		if (dragging.startDragID == dragging.inbetweenEndID) {
			return;
		}

		let newTimestamps = [ ...timestamps ];
		let index = newTimestamps.findIndex(x => x.id == dragging.startDragID);
		
		let timestamp = newTimestamps.splice(index, 1);

		let whereIndex = newTimestamps.findIndex(x => x.id == dragging.inbetweenEndID);

		if (dragging.inbetweenEndID == null) {
			newTimestamps.push(timestamp[0]);
		}
		else {
			newTimestamps.splice(whereIndex, 0, timestamp[0]);
		}

		onTimestampsChanged(newTimestamps);
	};

	return (
		<>
			<DragList
				className="timestamp-list"
				dragListName="timestamp-dl"
				onDragStart={() => setActivelyDragging(true)}
				onDragChanged={(e) => {
					setDragging(e);
					setIsDragging(true);
				}}
				onDragEnd={dragEnd}>
				{
					timestamps.length != 0 ?
						timestamps.map(t =>
							<DragListItem id={t.id} key={t.id}>
								<>
									{
										<hr
											className="move-line bold-separator"
											data-is-visible={t.id == timestamps[0].id && !dragging?.notInBounds && dragging?.inbetweenEndID == t.id && isDragging}/>
									}
									<VideoTimestamp
										className={isDragging && !dragging?.notInBounds && dragging?.startDragID == t.id ? "drag-list-active-timestamp" : "drag-list-timestamp"}
										key={t.id}
										videoID={videoID}
										timestamp={t}
										isAutoplay={autoplayID == t.id}
										onAutoplayClick={() => dispatch(videoActions.changeAutoplayTimestamp({ videoID, timestamp: t.id }))}
										onChange={onTimestampChanged}
										allowControls={!isDragging}/>
									{
										<hr
											className="move-line"
											data-is-visible={!dragging?.notInBounds && dragging?.inbetweenStartID == t.id && isDragging}/>
									}
								</>
							</DragListItem>
						) :
						<span className="empty-timestamps-message">No timestamps found.</span>
				}
			</DragList>
		</>
	);
}
