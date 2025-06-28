import {
	createLocalStorageArea,
	createSessionStorageArea,
	createSyncStorageArea,
	createManagedStorageArea,
	onChanged,
} from '@lmcd/mock-storagearea';

export function checkAndImplementLocalStorage() {
	if (chrome.storage != undefined) {
		return;
	}

	const local = createLocalStorageArea();
	const session = createSessionStorageArea();
	const sync = createSyncStorageArea();
	const managed = createManagedStorageArea();

	chrome.storage = {
		local,
		session,
		sync,
		managed,
		// @ts-ignore
		onChanged: onChanged({ session, local, sync, managed }),
	}
}

