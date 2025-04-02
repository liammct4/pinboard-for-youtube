import { StorageWrapper } from "../../components/features/storage/StorageWrapper";
import { useLocalStorage } from "../../components/features/storage/useLocalStorage";
import { useLocalVideoData } from "../features/useLocalVideoData";
import { TimelineContainer } from "./TimelineContainer/TimelineContainer";

export function TimelineApp() {
	return (
		<StorageWrapper>
			<TimelineContainer/>
		</StorageWrapper>
	);
}
