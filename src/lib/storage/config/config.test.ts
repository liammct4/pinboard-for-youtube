import { sampleVideoData } from "../../../../testData/testDataSet";
import { IConfig, getUserConfig } from "./config";
import { IStorage } from "../storage";

let storageTemplate: IStorage = {
	user_data: {
		videos: sampleVideoData,
		config: {

		}
	},
	temp_state: {
		expandedVideos: []
	}
}

async function prepareStorage(setTemplate: boolean = true) : Promise<void> {
	await chrome.storage.local.clear();

	if (!setTemplate) {
		return;
	}

	await chrome.storage.local.set(storageTemplate);
}

describe("Getting user config data from local storage 'getUserConfig()'.", () => {
	test("gets user config data from local storage.", async () => {
		await prepareStorage();

		// This is to be filled and changed when new options become available.
		let expectedConfig: IConfig = {

		}
		
		expect(await getUserConfig()).toEqual(expectedConfig);
	});
	test("throws an error when attempting to get user config data from local storage when it does not exist.", async () => {
		await prepareStorage(false);
		
		await expect(async () => await getUserConfig())
			.rejects
			.toThrowError(Error);
	});
});
