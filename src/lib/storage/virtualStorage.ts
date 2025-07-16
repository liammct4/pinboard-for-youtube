import { checkAndImplementLocalStorage } from "../browser/features/localStorage";
import { getApplicationContextType, IMetaStorage, IStorage } from "./storage";

checkAndImplementLocalStorage();

const DEBUG_STORAGE = false;

/*
Acts as a StorageArea but does not immediately push
changes to the actual storage area. Instead waiting with a delay.
Allows multiple writes to storage concurrently without overwriting data.
*/
export class VirtualStorageArea<T extends IMetaStorage> {
	public delayTime: number = 15;
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

	private async check() {
		if (!this.saved) {
			if (Date.now() > this.pushChangesTime) {
				this.virtualStorage.meta.author = getApplicationContextType();
				this.saved = true;

				if (DEBUG_STORAGE) {
					console.log(this.virtualStorage);
				}
				
				await this.storageArea.set(this.virtualStorage);
			}
			else {
				setTimeout(() => this.check(), 10);
			}
		}
	}
}

export const ExtensionVirtualStorage = new VirtualStorageArea<IStorage>(chrome.storage.local);
