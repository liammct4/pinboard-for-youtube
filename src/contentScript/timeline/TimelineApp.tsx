import { Provider } from "react-redux";
import { StorageWrapper } from "../../components/features/storage/StorageWrapper";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { TextMeasurerWrapper } from "../../components/features/useTextMeasurer";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { TimelineContainer } from "./TimelineContainer/TimelineContainer";
import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";

export interface ITimelineAppProperties {
	storage: IStorage;
}

export function TimelineApp({ storage }: ITimelineAppProperties) {
	return (
		<Provider store={store}>
			<StorageWrapper startValue={storage}>
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
