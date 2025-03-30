import { useContext, useEffect, useState } from "react";
import { DragEvent, DragList } from "../../../../lib/dragList/DragList";
import { DragListItem } from "../../../../lib/dragList/DragListItem";
import { Timestamp } from "../../../../lib/video/video";
import { VideoTimestamp } from "../VideoTimestamp/VideoTimestamp";
import "./TimestampList.css"
import { ITimestampListStateContext, TimestampListStateContext } from "../../navigation/VideoDirectoryBrowser/VideoDirectoryBrowser";

export interface ITimestampListProperties {
	videoID: string;
	timestamps: Timestamp[];
	onTimestampsChanged: (newTimestamps: Timestamp[]) => void;
	onTimestampChanged: (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => void;
}

export function TimestampList({ timestamps, videoID, onTimestampsChanged, onTimestampChanged }: ITimestampListProperties): React.ReactNode {
	const [ dragging, setDragging ] = useState<DragEvent | null>(null);
	const [ isDragging, setIsDragging ] = useState<boolean>(false);
	const { activelyDragging, setActivelyDragging } = useContext<ITimestampListStateContext>(TimestampListStateContext);

	// When dragging ends, reorder the list.
	useEffect(() => {
		if (isDragging || dragging == null || dragging == "NOT_IN_BOUNDS") {
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
	}, [isDragging]);

	return (
		<>
			<DragList
				className="timestamp-list"
				dragListName="timestamp-dl"
				onDrag={(e) => {
					setDragging(e);
					setIsDragging(true);
					setActivelyDragging(true);
				}}
				onDragEnd={() => {
					setIsDragging(false);
					setActivelyDragging(false);
				}}>
				{
					timestamps.length != 0 ?
						timestamps.map(x =>
							<DragListItem id={x.id} key={x.id}>
								<>
									{
										<hr
											className="move-line bold-separator"
											data-is-visible={x.id == timestamps[0].id && dragging != "NOT_IN_BOUNDS" && dragging?.inbetweenEndID == x.id && isDragging}/>
									}
									<VideoTimestamp
										className={isDragging && dragging != "NOT_IN_BOUNDS" && dragging?.startDragID == x.id ? "drag-list-active-timestamp" : "drag-list-timestamp"}
										key={x.id}
										videoID={videoID}
										timestamp={x}
										onChange={onTimestampChanged}
										allowControls={!isDragging}/>
									{
										<hr
											className="move-line"
											data-is-visible={dragging != "NOT_IN_BOUNDS" && dragging?.inbetweenStartID == x.id && isDragging}/>
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
