import { getApplicationContextType, IMetaStorage, IStorage } from "./storage";

/*
Acts as a StorageArea but does not immediately push
changes to the actual storage area. Instead waiting with a delay.
Allows multiple writes to storage concurrently without overwriting data.
*/
export class VirtualStorageArea<T extends IMetaStorage> {
	public delayTime: number = 60;
	private pushChangesTime: number;
	private virtualStorage: T;
	private saved: boolean = true;

	constructor() {
		this.pushChangesTime = Date.now();
		this.virtualStorage = {
			meta: {
				author: getApplicationContextType()
			}
		} as T;
	}
	
	public async modifyStorage(modifier: (storage: T) => void) {
		if (this.saved) {
			this.virtualStorage = await chrome.storage.local.get() as T;
		}
		
		setTimeout(() => modifier(this.virtualStorage), this.delayTime / 2);

		this.pushChangesTime = Date.now() + this.delayTime;
		this.saved = false;
		
		this.check();
	}

	private check() {
		if (!this.saved) {
			if (Date.now() > this.pushChangesTime) {
				this.virtualStorage.meta.author = getApplicationContextType();
				this.saved = true;

				chrome.storage.local.set(this.virtualStorage);
			}
			else {
				setTimeout(() => this.check(), 10);
			}
		}
	}
}

export const ExtensionVirtualStorage = new VirtualStorageArea<IStorage>();
