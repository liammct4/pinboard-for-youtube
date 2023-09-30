import { sampleConfigData, sampleVideoData } from "../../../../testData/testDataSet";
import { IConfig, getUserConfig } from "./config";
import { IStorage } from "../storage";
import { getCurrentTheme } from "./theme/theme";

let storageTemplate: IStorage = {
	user_data: {
		videos: sampleVideoData,
		config: sampleConfigData,
		tagDefinitions: []
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
	it("throws an error when attempting to get user config data from local storage when it does not exist.", async () => {
		await prepareStorage(false);
		
		await expect(async () => await getUserConfig())
			.rejects
			.toThrowError(Error);
	});
});
