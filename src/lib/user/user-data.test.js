import * as userData from "./user-data.js"
import { sampleVideoData } from "./../../data/testDataSet.js"

async function prepareStorage(setTemplate = true) {
	await chrome.storage.local.clear();

	if (!setTemplate) {
		return;
	}

	let template = {
		"user_data": {
			"videos": sampleVideoData,
			"config": {

			}
		}
	}

	await chrome.storage.local.set(template);
}

describe("Local storage operations.", () => {
	test("checks whether the default data has been initialized with a correct value.", async () => {
		await prepareStorage();

		expect(await userData.ensureInitialized()).toBeUndefined();
	});
	test("set's storage to a default template when it is empty (as is the case when the extension is first installed).", async () => {
		await prepareStorage(false);		

		let defaultTemplate = {
			"user_data": {
				"videos": [],
				"config": {

				}
			}
		};

		await userData.ensureInitialized();

		expect(await chrome.storage.local.get()).toEqual(defaultTemplate);
	});
	test("throws an error whenever storage contains incorrect data, (E.g. corruption).", async () => {
		await prepareStorage(false);

		let badData = {
			"userdata": {
				"videos": [
					{
						"video_id": null
					}
				],
				"config": []
			}
		};

		await chrome.storage.local.set(badData);

		await expect(async () => await userData.ensureInitialized())
			.rejects
			.toThrowError(Error);
	});
});

describe("Extracting data from local storage.", () => {
	test("gets user video data from local storage.", async () => {
		await prepareStorage();
		
		expect(await userData.getStoredVideos()).toEqual(sampleVideoData);
	});
	test("throws an error when attempting to get user video data from local storage when it does not exist.", async () => {
		await prepareStorage(false);
		
		await expect(async () => await userData.getStoredVideos())
			.rejects
			.toThrowError(Error);
	});
	test("gets user config data from local storage.", async () => {
		await prepareStorage();

		// This is to be filled and changed when new options become available.
		let expectedConfig = {

		}
		
		expect(await userData.getUserConfig()).toEqual(expectedConfig);
	});
	test("throws an error when attempting to get user config data from local storage when it does not exist.", async () => {
		await prepareStorage(false);
		
		await expect(async () => await userData.getUserConfig())
			.rejects
			.toThrowError(Error);
	});
});
