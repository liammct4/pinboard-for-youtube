import { createContext } from "react";
import { IVideo, Timestamp } from "../../../lib/video/video";
import { sampleVideoData } from "../../../../testData/testDataSet";

export interface IVideoItemContext {
	video: IVideo;
	onTimestampChanged: (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => void;
	onTimestampAdded: (newTimestamp: Timestamp) => void;
	setTimestamps: (timestamps: Timestamp[]) => void;
}

export const VideoItemContext = createContext<IVideoItemContext>({
	video: sampleVideoData[0],
	onTimestampChanged: () => console.error("VideoItemContext.onTimestampChanged no context provided"),
	onTimestampAdded: () => console.error("VideoItemContext.onTimestampAdded no context provided"),
	setTimestamps: () => console.error("VideoItemContext.setTimestamps no context provided")
});
