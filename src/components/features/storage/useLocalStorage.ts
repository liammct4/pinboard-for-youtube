import { useContext, useEffect, useState } from "react"
import { BLANK_STORAGE_TEMPLATE, IStorage } from "../../../lib/storage/storage";
import { ILocalStorageContext, LocalStorageContext } from "./StorageWrapper";

export function useLocalStorage() {
	const { storageCache, setStorageCache } = useContext<ILocalStorageContext>(LocalStorageContext);
	
	return {
		storage: storageCache,
		setStorage: setStorageCache
	}
}
