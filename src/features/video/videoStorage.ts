import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";
import { IvideoSlice } from "./videoSlice";

export function saveVideoSliceToStorage(storage: IStorage, videoSlice: IvideoSlice) {
	storage.userData.videos = videoSlice.videos;
}
