import { IStorage } from "../../lib/storage/storage";
import { IDirectorySlice } from "./directorySlice";

export function saveDirectorySliceToStorage(storage: IStorage, videoSlice: IDirectorySlice) {
	storage.userData.directory = videoSlice.videoBrowser;
}
