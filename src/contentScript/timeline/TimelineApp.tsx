import { Provider } from "react-redux";
import { StorageWrapper } from "../../components/features/storage/StorageWrapper";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { TextMeasurerWrapper } from "../../components/features/useTextMeasurer";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { TimelineContainer } from "./TimelineContainer/TimelineContainer";
import { store } from "../../app/store";

export function TimelineApp() {
	return (
		<Provider store={store}>
			<StorageWrapper>
				<StyleContextWrapper update-theme>
					<TextMeasurerWrapper>
						<VideoWrapper>
							<TimelineContainer/>
						</VideoWrapper>
					</TextMeasurerWrapper>
				</StyleContextWrapper>
			</StorageWrapper>
		</Provider>
	);
}
