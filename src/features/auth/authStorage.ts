import { store } from "../../app/store";
import { IStorage } from "../../lib/storage/storage";
import { IAuthSlice } from "./authSlice";

export function saveAuthSliceToStorage(storage: IStorage, authSlice: IAuthSlice) {
	storage.auth.currentUser = authSlice.currentUser;
}
