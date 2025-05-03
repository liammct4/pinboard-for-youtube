import { Provider } from "react-redux";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { VideoTimestampButton } from "./components/VideoTimestampButton/VideoTimestampButton";
import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";
import { cloneDirectory } from "../../components/video/navigation/directory";

export interface IControlsAppProperties {
	storage: IStorage;
}

export function ControlsApp({ storage }: IControlsAppProperties) {
	return (
		<Provider store={store}>
			<StyleContextWrapper>
				<VideoWrapper initialDirectory={cloneDirectory(storage.userData.directoryRoot)}>
					<VideoTimestampButton/>
				</VideoWrapper>
			</StyleContextWrapper>
		</Provider>
	);
}
