import { IVideo, Timestamp } from "../../../lib/video/video";

export interface IVideoItemProperties {
	video: IVideo;
	onTimestampChanged: (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => void;
}
