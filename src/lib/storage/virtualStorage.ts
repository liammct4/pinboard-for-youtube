import { checkAndImplementLocalStorage } from "../browser/features/localStorage";
import { getApplicationContextType, ILocalStorage, IMetaStorage, IPrimaryStorage } from "./storage";

checkAndImplementLocalStorage();

/*
Acts as a StorageArea but does not immediately push
changes to the actual storage area. Instead waiting with a delay.
Allows multiple writes to storage concurrently without overwriting data,
as well as preventing exceeding the request limit by chrome.storage.sync (MAX_WRITE_OPERATIONS_PER_MINUTE).
*/
export class VirtualStorageArea<T extends IMetaStorage> {
	public delayTime: number = 230;
	private pushChangesTime: number;
	private virtualStorage: T;
	private saved: boolean = true;
	// @ts-ignore StorageArea type is inaccessible for whatever reason.
	private storageArea: any;

	constructor(storageArea: any) {
		this.pushChangesTime = Date.now();
		this.virtualStorage = {
			meta: {
				author: getApplicationContextType()
			}
		} as T;
		this.storageArea = storageArea;
	}
	
	public async modifyStorage(modifier: (storage: T) => void) {
		if (this.saved) {
			this.virtualStorage = await this.storageArea.get() as T;
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

				this.storageArea.set(this.virtualStorage);
			}
			else {
				setTimeout(() => this.check(), 10);
			}
		}
	}
}

export const ExtensionMainVirtualStorage = new VirtualStorageArea<IPrimaryStorage>(chrome.storage.sync);
export const ExtensionLocalVirtualStorage = new VirtualStorageArea<ILocalStorage>(chrome.storage.local);
