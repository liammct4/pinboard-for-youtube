import { Provider, useSelector } from "react-redux";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { VideoTimestampButton } from "./components/VideoTimestampButton/VideoTimestampButton";
import { RootState, store } from "../../app/store";
import { IPrimaryStorage } from "../../lib/storage/storage";

export function ControlsApp() {
	return (
		<Provider store={store}>
			<StyleContextWrapper>
				<VideoTimestampButton/>
			</StyleContextWrapper>
		</Provider>
	);
}
