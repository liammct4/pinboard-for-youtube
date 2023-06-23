import * as userData from "./user-data.ts"
import { sampleVideoData } from "./../../data/testDataSet.ts"

let storageTemplate: userData.IStorage = {
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

		expect(await userData.ensureInitialized()).toBeUndefined();
	});
	test("set's storage to a default template when it is empty (as is the case when the extension is first installed).", async () => {
		await prepareStorage(false);		

		let defaultTemplate: userData.IStorage = {
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

		let badData: any = {
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
			.toThrow(Error);
	});
});

describe("Extracting data from local storage.", () => {
	describe("Getting video data from local storage.", () => {
		describe("Getting the entirety of the videos stored in local storage 'getStoredVideos()'.", () => {
			it("gets the entire array of just added video data.", async () => {
				// Default data is added with prepareStorage()
				await prepareStorage();
				
				expect(await userData.getStoredVideos()).toEqual(sampleVideoData);
			});
			test("throws an error when attempting to get user video data from local storage when it does not exist.", async () => {
				await prepareStorage(false);
				
				await expect(async () => await userData.getStoredVideos())
					.rejects
					.toThrowError(Error);
			});
		});
		describe("Searching for a video in local storage 'getIndexOfVideo()'.", () => {
			it("retrieves the correct index of a video which is present in the local storage.", async () => {
				await prepareStorage();

				let videoID: string = "ZjVAsJOl8SM"

				expect(await userData.getIndexOfVideo(videoID)).toEqual(3);
			});
			it("retrieves the correct index of a video which has just been added to local storage.", async () => {
				await prepareStorage();

				let videoID: string = "y9n6HkftavM"
				let newVideo: userData.Video = {
					"videoID": "y9n6HkftavM",
					"timestamps": [
						{ "time": 372, "message": "Important point!" },
						{ "time": 625, "message": "Watch later." },
					]
				};

				await userData.insertVideo(4, newVideo);

				expect(await userData.getIndexOfVideo(videoID)).toEqual(4);
			});
			it("returns -1 if no video is found within local storage.", async () => {
				await prepareStorage();

				let videoID: string = "AsykNkUMoNU"

				expect(await userData.getIndexOfVideo(videoID)).toEqual(-1);
			});
		});
		describe("Retrieving a video in local storage by index 'getVideoFromIndex()'.", () => {
			it("retrieves the first video which is present in the local storage.", async () => {
				await prepareStorage();

				let expectedID: string = "LXb3EKWsInQ"
				let result: userData.Video | null = await userData.getVideoFromIndex(0);

				expect(result.videoID).toEqual(expectedID);
			});
			it("throws an error if the index is out of bounds.", async () => {
				await prepareStorage();

				expect(async () => await userData.getVideoFromIndex(-2))
					.rejects
					.toThrowError(Error);
			});
		});
		describe("Retrieving a video in local storage by ID 'getVideoFromVideoID()'.", () => {
			it("retrieves the first video which is present in the local storage.", async () => {
				await prepareStorage();

				let expectedID: string = "LXb3EKWsInQ"
				let result: userData.Video | null = await userData.getVideoFromVideoID(expectedID);

				expect(result?.videoID).toEqual(expectedID);
			});
			it("returns null if the video does not exist.", async () => {
				await prepareStorage();

				let nonExistantVideo: string = "AsykNkUMoNU";

				expect(await userData.getVideoFromVideoID(nonExistantVideo)).toBe(null);
			});
		});
	});
	describe("Getting user config data from local storage 'getUserConfig()'.", () => {
		test("gets user config data from local storage.", async () => {
			await prepareStorage();

			// This is to be filled and changed when new options become available.
			let expectedConfig: userData.IConfig = {

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
});

describe("Modifying user data in local storage.", () => {
	describe("Adding a new video 'pushVideo()'.", () => {
		it("adds a new video to the end of user videos in local storage.", async () => {
			await prepareStorage();

			let newVideo: userData.Video = {
				"videoID": "y9n6HkftavM",
				"timestamps": [
					{ "time": 372, "message": "Important point!" },
					{ "time": 625, "message": "Watch later." },
				]
			};

			let expected: Array<userData.Video> = [ ...storageTemplate["user_data"]["videos"], newVideo ];

			await userData.pushVideo(newVideo);

			expect(await userData.getStoredVideos()).toEqual(expected);
		});
		it("replaces an existing video in local storage when provided with an existing video ID.", async () => {
			await prepareStorage();

			let existingVideoID: string = "LXb3EKWsInQ"
			let newVideo: userData.Video = {
				"videoID": "LXb3EKWsInQ",
				"timestamps": [
					{ "time": 923, "message": "In lacinia nibh odio finibus nisl." },
					{ "time": 1921, "message": "In vulputate non odio vitae iaculis." },
					{ "time": 3964, "message": "At dignissim ligula dui vel erat." },
					{ "time": 129, "message": "Nulla felis ligula." }
				]
			};

			await userData.pushVideo(newVideo);

			expect(await userData.getVideoFromVideoID(existingVideoID)).toEqual(newVideo);
			expect(await userData.getIndexOfVideo(existingVideoID)).toEqual(0);
		});
		it("throws an error when invalid data is provied.", async () => {
			await prepareStorage();

			let invalidVideo: any = {
				"videoID": "y9n6HkftavM",
				"timestamps": [
					{ "time": "Important point!", "message": 10 }
				]
			};

			await expect(async () => await userData.pushVideo(invalidVideo))
				.rejects
				.toThrowError(Error);
		});
	});
	describe("Adding a set of videos 'pushVideoBatch()'.", () => {
		it("adds a set of videos to the end of user videos in local storage.", async () => {
			await prepareStorage();

			let newVideos: Array<userData.Video> = [
				{
					"videoID": "Sx-QWXNjjyk",
					"timestamps": [
						{ "time": 419, "message": "Extra important point!" }
					]
				},
				{
					"videoID": "QJ792KIE82Q",
					"timestamps": [
						{ "time": 816, "message": "Check the background." },
						{ "time": 625, "message": "Lorem ipsum dolor sit amet." },
						{ "time": 1062, "message": "Nunc magna enim, consequat non sagittis ut." }
					]
				},
				{
					"videoID": "y9n6HkftavM",
					"timestamps": [
						{ "time": 372, "message": "Important point!" },
						{ "time": 625, "message": "Watch later." }
					]
				}
			];

			let expected: Array<userData.Video> = [ ...storageTemplate["user_data"]["videos"], ...newVideos ];

			await userData.pushVideoBatch(newVideos);

			expect(await userData.getStoredVideos()).toEqual(expected);
		});
		it("replaces an existing subset of videos in local storage when provided with an array of videos which have some reoccurances.", async () => {
			await prepareStorage();

			let newVideos: Array<userData.Video> = [
				// Already exists.
				{
					"videoID": "LXb3EKWsInQ",
					"timestamps": [
						{ "time": 923, "message": "In lacinia nibh odio finibus nisl." },
						{ "time": 1921, "message": "In vulputate non odio vitae iaculis." },
						{ "time": 3964, "message": "At dignissim ligula dui vel erat." },
						{ "time": 129, "message": "Nulla felis ligula." }
					]
				},
				// Unique, added to end.
				{
					"videoID": "y9n6HkftavM",
					"timestamps": [
						{ "time": 372, "message": "Important point!" },
						{ "time": 625, "message": "Watch later." },
					]
				},
				// Already exists.
				{
					"videoID": "njX2bu-_Vw4",
					"timestamps": [
						{ "time": 10, "message": "Morbi efficitur." },
					]
				}
			];

			let expected: Array<userData.Video> = [
				{
					"videoID": "LXb3EKWsInQ",
					"timestamps": [
						{ "time": 923, "message": "In lacinia nibh odio finibus nisl." },
						{ "time": 1921, "message": "In vulputate non odio vitae iaculis." },
						{ "time": 3964, "message": "At dignissim ligula dui vel erat." },
						{ "time": 129, "message": "Nulla felis ligula." }
					]
				},
				{
					"videoID": "njX2bu-_Vw4",
					"timestamps": [
						{ "time": 10, "message": "Morbi efficitur." },
					]
				},
				{
					"videoID": "AKeUssuu3Is",
					"timestamps": [
						{ "time": 16, "message": "Maecenas lectus nisl, pretium." }
					]
				},
				{
					"videoID": "ZjVAsJOl8SM",
					"timestamps": [
						{ "time": 1063, "message": "Another timestamp." }
					]
				},
				{
					"videoID": "PnvkrBXmLSI",
					"timestamps": [
						{ "time": 60342, "message": "Phasellus convallis arcu in malesuada mattis." },
						{ "time": 0, "message": "Maximus quis purus." },
					]
				},
				{
					"videoID": "ERYG3NE1DO8",
					"timestamps": []
				},
				{
					"videoID": "y9n6HkftavM",
					"timestamps": [
						{ "time": 372, "message": "Important point!" },
						{ "time": 625, "message": "Watch later." },
					]
				}
			];

			await userData.pushVideoBatch(newVideos);
			
			let currentVideos: Array<userData.Video> = await userData.getStoredVideos();

			expect(currentVideos).toEqual(expected);
		});
	});
	describe("Inserting a new video into an existing set of videos 'insertVideo()'.", () => {
		it("inserts a new video to the third position of user videos in local storage.", async () => {
			await prepareStorage();

			let newVideo: userData.Video = {
				"videoID": "y9n6HkftavM",
				"timestamps": [
					{ "time": 372, "message": "Important point!" },
					{ "time": 625, "message": "Watch later." },
				]
			};

			let expected: Array<userData.Video> = [ ...storageTemplate["user_data"]["videos"] ];
			expected.splice(2, 0, newVideo);

			await userData.insertVideo(2, newVideo);

			expect(await userData.getStoredVideos()).toEqual(expected);
		});
		it("throws an error when a negative index is provied.", async () => {
			await prepareStorage();

			let newVideo: userData.Video = {
				"videoID": "y9n6HkftavM",
				"timestamps": [
					{ "time": 372, "message": "Important point!" },
					{ "time": 625, "message": "Watch later." },
				]
			};

			await expect(async () => await userData.insertVideo(-2, newVideo))
				.rejects
				.toThrowError(Error);
		});
	});
	describe("Inserting a set of videos into existing storage 'insertVideoBatch()'.", () => {
		it("inserts a set of new videos to the 4th position of the user videos in local storage.", async () => {
			await prepareStorage();

			let newVideos: Array<userData.Video> = [
				{
					"videoID": "Sx-QWXNjjyk",
					"timestamps": [
						{ "time": 419, "message": "Extra important point!" }
					]
				},
				{
					"videoID": "QJ792KIE82Q",
					"timestamps": [
						{ "time": 816, "message": "Check the background." },
						{ "time": 625, "message": "Lorem ipsum dolor sit amet." },
						{ "time": 1062, "message": "Nunc magna enim, consequat non sagittis ut." }
					]
				},
				{
					"videoID": "y9n6HkftavM",
					"timestamps": [
						{ "time": 372, "message": "Important point!" },
						{ "time": 625, "message": "Watch later." }
					]
				}
			];

			let expected: Array<userData.Video> = [ ...storageTemplate["user_data"]["videos"] ];
			expected.splice(3, 0, ...newVideos);

			await userData.insertVideoBatch(3, newVideos);

			expect(await userData.getStoredVideos()).toEqual(expected);
		});
	});
	describe("Removing user videos from local storage.", () => {
		describe("Removing a video by ID from local storage 'removeVideoByVideoID()'.", () => {
			it("removes a single video from local storage.", async () => {
				await prepareStorage();

				let videoToRemove: string = "ZjVAsJOl8SM";
				await userData.removeVideoByVideoID(videoToRemove);

				expect(await userData.getVideoFromVideoID(videoToRemove)).toBe(null);
			});
			it("returns correct true or false values depending on if a video was successfully removed.", async () => {
				await prepareStorage();

				let existantVideoToRemove: string = "ZjVAsJOl8SM";
				let nonExistantVideoToRemove: string = "AsykNkUMoNU";

				let shouldSucceed: boolean = await userData.removeVideoByVideoID(existantVideoToRemove);
				let shouldNotSucceed: boolean = await userData.removeVideoByVideoID(nonExistantVideoToRemove);

				expect(shouldSucceed).toBe(true);
				expect(shouldNotSucceed).toBe(false);
			});
		})
	});
});
