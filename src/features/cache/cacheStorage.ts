import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";
import { ICacheSlice } from "./cacheSlice";

export function saveCacheSliceToStorage(storage: IStorage, cacheSlice: ICacheSlice) {
	storage.cache.videos = cacheSlice.videoCache;
}
