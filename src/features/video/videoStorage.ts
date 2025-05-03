import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";
import { IVideoSlice } from "./videoSlice";

export function saveVideoSliceToStorage(storage: IStorage, videoSlice: IVideoSlice) {
	storage.userData.videos = videoSlice.videos;
}
