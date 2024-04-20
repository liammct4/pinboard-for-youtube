import { sampleConfigData, sampleVideoData } from "../../../../testData/testDataSet";
import { IStorage } from "../storage";
import { addExpandedID, getExpandedVideos, removeExpandedID } from "./tempState";

let storageTemplate: IStorage = {
	user_data: {
		videos: sampleVideoData,
		config: sampleConfigData,
		tagDefinitions: [],
		tagFilter: ""
	},
	temp_state: {
		expandedVideos: ["ERYG3NE1DO8", "ZjVAsJOl8SM", "AKeUssuu3Is"],
		layout: {
			isCurrentVideosSectionExpanded: true
		}
	},
	auth: {
		currentUser: undefined
	},
	persistentState: {
		path: undefined,
		resetPasswordState: undefined,
		resendVerificationEmailState: undefined
	}
}

async function prepareStorage(setTemplate: boolean = true) : Promise<void> {
	await chrome.storage.local.clear();

	if (!setTemplate) {
		return;
	}

	await chrome.storage.local.set(storageTemplate);
}

describe("getting and modifying expanded videos in temporary storage.", () => {
	describe("getting expanded videos in storage. 'getExpandedVideos()'", () => {
		it("returns an array of video ID's which have been added.", async () => {
			await prepareStorage();

			expect(await getExpandedVideos()).toStrictEqual(storageTemplate.temp_state.expandedVideos);
		});
	});
	describe("adding ID's to expanded videos in temporary storage. 'addExpandedID()'", () => {
		it("adds a new video ID to the end of the temporary storage array.", async () => {
			await prepareStorage();

			let newID = "LXb3EKWsInQ";
			let expected = [ ...await getExpandedVideos(), newID ];

			await addExpandedID(newID);

			expect(await getExpandedVideos()).toStrictEqual(expected);
		});
		it("does nothing if an ID provided has already been added.", async () => {
			await prepareStorage();

			let existingID = "ERYG3NE1DO8";
			let before = await getExpandedVideos();

			await addExpandedID(existingID);

			expect(await getExpandedVideos()).toStrictEqual(before);
		});
	});
	describe("removing ID's to expanded videos in temporary storage. 'removeExpandedID()'", () => {
		it("removes an existing video ID in the temporary storage array.", async () => {
			await prepareStorage();

			let IDtoRemove = "ZjVAsJOl8SM";
			let expected = [ ...await getExpandedVideos() ];
			expected.splice(1, 1);

			await removeExpandedID(IDtoRemove);

			expect(await getExpandedVideos()).toStrictEqual(expected);
		});
		it("does nothing if a provided ID does not exist.", async () => {
			await prepareStorage();

			let existingID = "LXb3EKWsInQ";
			let before = await getExpandedVideos();

			await removeExpandedID(existingID);

			expect(await getExpandedVideos()).toStrictEqual(before);
		});
	});
});
