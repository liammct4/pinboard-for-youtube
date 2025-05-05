import { Provider } from "react-redux";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { TextMeasurerWrapper } from "../../components/features/useTextMeasurer";
import { TimelineContainer } from "./TimelineContainer/TimelineContainer";
import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";

export function TimelineApp() {
	return (
		<Provider store={store}>
			<StyleContextWrapper update-theme>
				<TextMeasurerWrapper>
					<TimelineContainer/>
				</TextMeasurerWrapper>
			</StyleContextWrapper>
		</Provider>
	);
}
