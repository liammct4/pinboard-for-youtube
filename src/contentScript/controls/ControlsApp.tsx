import { Provider } from "react-redux";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { VideoTimestampButton } from "./components/VideoTimestampButton/VideoTimestampButton";
import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";

export function ControlsApp() {
	return (
		<Provider store={store}>
			<StyleContextWrapper>
				<VideoTimestampButton/>
			</StyleContextWrapper>
		</Provider>
	);
}
