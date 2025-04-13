import { StorageWrapper } from "../../components/features/storage/StorageWrapper";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { TextMeasurerWrapper } from "../../components/features/useTextMeasurer";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { TimelineContainer } from "./TimelineContainer/TimelineContainer";

export function TimelineApp() {
	return (
		<StorageWrapper>
			<StyleContextWrapper>
				<TextMeasurerWrapper>
					<VideoWrapper>
						<TimelineContainer/>
					</VideoWrapper>
				</TextMeasurerWrapper>
			</StyleContextWrapper>
		</StorageWrapper>
	);
}
