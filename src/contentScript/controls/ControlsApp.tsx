import { Provider } from "react-redux";
import { StorageWrapper } from "../../components/features/storage/StorageWrapper";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { VideoWrapper } from "../../components/features/videoAccess/VideoWrapper";
import { VideoTimestampButton } from "./components/VideoTimestampButton/VideoTimestampButton";
import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";

export interface IControlsAppProperties {
	storage: IStorage;
}

export function ControlsApp({ storage }: IControlsAppProperties) {
	return (
		<Provider store={store}>
			<StorageWrapper startValue={storage}>
				<StyleContextWrapper>
					<VideoWrapper>
						<VideoTimestampButton/>
					</VideoWrapper>
				</StyleContextWrapper>
			</StorageWrapper>
		</Provider>
	);
}
