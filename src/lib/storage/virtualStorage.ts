import { BLANK_STORAGE_TEMPLATE, getApplicationContextType, IStorage, modifyStorage } from "./storage";

/*
Acts as a StorageArea but does not immediately push
changes to the actual storage area. Instead waiting with a delay.
*/
export class VirtualStorageArea {
	public delayTime: number = 50;
	private pushChangesTime: number;
	private virtualStorage: IStorage;

	constructor(start: IStorage) {
		this.pushChangesTime = Date.now();
		this.virtualStorage = start;
	}

	public get storage() {
		return this.virtualStorage;
	}
	
	public set storage(storage: IStorage) {
		this.virtualStorage = storage;
		this.pushChangesTime = Date.now() + this.delayTime;
		
		this.check();
	}

	private check() {
		if (Date.now() > this.pushChangesTime) {
			this.virtualStorage.meta.author = getApplicationContextType();
			chrome.storage.local.set(this.virtualStorage);
		}
		else {
			setTimeout(this.check, 10);
		}
	}
}

export const ExtensionVirtualStorage = new VirtualStorageArea(BLANK_STORAGE_TEMPLATE);
