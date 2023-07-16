import { sampleVideoData } from "../../data/testDataSet";
import { IStorage, ensureInitialized } from "./storage";

let storageTemplate: IStorage = {
	"user_data": {
		"videos": sampleVideoData,
		"config": {

		}
	}
}

async function prepareStorage(setTemplate: boolean = true) : Promise<void> {
	await chrome.storage.local.clear();

	if (!setTemplate) {
		return;
	}

	await chrome.storage.local.set(storageTemplate);
}

describe("Local storage operations.", () => {
	test("checks whether the default data has been initialized with a correct value.", async () => {
		await prepareStorage();

		expect(await ensureInitialized()).toBeUndefined();
	});
	test("set's storage to a default template when it is empty (as is the case when the extension is first installed).", async () => {
		await prepareStorage(false);		

		let defaultTemplate: IStorage = {
			"user_data": {
				"videos": [],
				"config": {

				}
			}
		};

		await ensureInitialized();

		expect(await chrome.storage.local.get()).toEqual(defaultTemplate);
	});
});
