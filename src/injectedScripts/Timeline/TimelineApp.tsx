import { StorageWrapper } from "../../components/features/storage/StorageWrapper";
import { TextMeasurerWrapper } from "../../components/features/useTextMeasurer";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { TimelineContainer } from "./TimelineContainer/TimelineContainer";

export function TimelineApp() {
	return (
		<StorageWrapper>
			<TextMeasurerWrapper>
				<VideoWrapper>
					<TimelineContainer/>
				</VideoWrapper>
			</TextMeasurerWrapper>
		</StorageWrapper>
	);
}
