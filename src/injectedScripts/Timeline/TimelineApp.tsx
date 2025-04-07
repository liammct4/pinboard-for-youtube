import { StorageWrapper } from "../../components/features/storage/StorageWrapper";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { TimelineContainer } from "./TimelineContainer/TimelineContainer";

export function TimelineApp() {
	return (
		<StorageWrapper>
			<VideoWrapper>
				<TimelineContainer/>
			</VideoWrapper>
		</StorageWrapper>
	);
}
