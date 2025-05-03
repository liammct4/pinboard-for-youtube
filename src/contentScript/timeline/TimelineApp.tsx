import { Provider } from "react-redux";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { TextMeasurerWrapper } from "../../components/features/useTextMeasurer";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { TimelineContainer } from "./TimelineContainer/TimelineContainer";
import { store } from "../../app/store";
import { cloneDirectory } from "../../lib/directory/directory";
import { IStorage } from "../../lib/storage/storage";

export interface ITimelineAppProperties {
	storage: IStorage;
}

export function TimelineApp({ storage }: ITimelineAppProperties) {
	return (
		<Provider store={store}>
			<StyleContextWrapper update-theme>
				<TextMeasurerWrapper>
					<VideoWrapper initialDirectory={cloneDirectory(storage.userData.directoryRoot)}>
						<TimelineContainer/>
					</VideoWrapper>
				</TextMeasurerWrapper>
			</StyleContextWrapper>
		</Provider>
	);
}
