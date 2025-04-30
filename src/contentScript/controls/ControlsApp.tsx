import { Provider } from "react-redux";
import { StorageWrapper } from "../../components/features/storage/StorageWrapper";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { VideoTimestampButton } from "./components/VideoTimestampButton/VideoTimestampButton";
import { store } from "../../app/store";

export function ControlsApp() {
	return (
		<Provider store={store}>
			<StorageWrapper>
				<StyleContextWrapper>
					<VideoWrapper>
						<VideoTimestampButton/>
					</VideoWrapper>
				</StyleContextWrapper>
			</StorageWrapper>
		</Provider>
	);
}
