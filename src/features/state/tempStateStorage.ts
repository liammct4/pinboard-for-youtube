import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";
import { ITempState } from "../../lib/storage/tempState/tempState";
import { IStateSlice } from "./tempStateSlice";

export function saveTempStateSliceToStorage(storage: IStorage, tempStateSlice: IStateSlice) {
	storage.tempState = {
		expandedVideos: tempStateSlice.expandedVideoIDs,
		currentDirectoryPath: tempStateSlice.currentDirectory,
		layout: tempStateSlice.layout,
		videoBrowserScrollDistance: tempStateSlice.videoBrowserScrollDistance
	};
}
