import { createContext, useEffect, useState } from "react";
import { BLANK_STORAGE_TEMPLATE, IStorage } from "../../../lib/storage/storage";
import { IWrapperProperties } from "../wrapper";

export interface IStorageWrapperProperties extends IWrapperProperties {
	startValue: IStorage
} 

export function StorageWrapper({ children, startValue }: IStorageWrapperProperties) {
	const [ storageCache, setStorageCache ] = useState<IStorage>(startValue);

	useEffect(() => {		
		chrome.storage.local.onChanged.addListener(() => {
			chrome.storage.local.get().then(storage => setStorageCache(storage as IStorage))
		});

		chrome.storage.local.get().then(storage => setStorageCache(storage as IStorage));
	}, []);

	const updateStorage = (newStorage: IStorage) => {
		setStorageCache(newStorage);
		chrome.storage.local.set(newStorage);
	}

	return (
		<LocalStorageContext.Provider value={{ storageCache, setStorageCache: updateStorage }}>
			{children}
		</LocalStorageContext.Provider>
	);
}

export interface ILocalStorageContext {
	storageCache: IStorage;
	setStorageCache: (storage: IStorage) => void;
}

export const LocalStorageContext = createContext<ILocalStorageContext>({
	storageCache: BLANK_STORAGE_TEMPLATE,
	setStorageCache: () => console.error("LocalStorageContext.setStorageCache, no context provided")
});
