import { StorageWrapper } from "../../components/features/storage/StorageWrapper";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { TextMeasurerWrapper } from "../../components/features/useTextMeasurer";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { VideoTimestampButton } from "./components/VideoTimestampButton/VideoTimestampButton";

export function ControlsApp() {
	return (
		<StorageWrapper>
			<StyleContextWrapper>
				<VideoWrapper>
					<VideoTimestampButton/>
				</VideoWrapper>
			</StyleContextWrapper>
		</StorageWrapper>
	);
}
