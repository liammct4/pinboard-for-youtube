/**
 * @jest-environment jsdom
*/

import * as youtubeUtil from "./youtubeUtil.ts"

describe("Extracting a video ID from provided link 'getVideoIdFromYouTubeLink()'", () => {
	test("extracts the video ID LXb3EKWsInQ from the link 'https://www.youtube.com/watch?v=LXb3EKWsInQ'", () => {
		expect(youtubeUtil.getVideoIdFromYouTubeLink("https://www.youtube.com/watch?v=LXb3EKWsInQ")).toEqual("LXb3EKWsInQ");
	});

	test("throws an error when a link with an invalid ID is provided (Not 11 characters long) 'https://www.youtube.com/watch?v=Lb3KWnQ'", () => {
		let testFunction = () => {
			youtubeUtil.getVideoIdFromYouTubeLink("https://www.youtube.com/watch?v=Lb3KWnQ")
		}

		expect(testFunction).toThrow(TypeError);
	});
	test("throws an error when a link with no ID is provided, 'https://www.youtube.com'", () => {
		let testFunction = () => {
			youtubeUtil.getVideoIdFromYouTubeLink("https://www.youtube.com")
		}

		expect(testFunction).toThrow(TypeError);
	});
});

describe("Creating a YouTube URL to a specific video from a video ID. 'getYouTubeLinkFromVideoID()'", () => {
	test("creates the link 'https://www.youtube.com/watch?v=LXb3EKWsInQ' from the provided ID of 'LXb3EKWsInQ'.", () => {
		expect(youtubeUtil.getYouTubeLinkFromVideoID("LXb3EKWsInQ")).toEqual("https://www.youtube.com/watch?v=LXb3EKWsInQ");
	});

	test("throws an error when an invalid ID is provided, 'LXb3E'.", () => {
		let testFunction = () => {
			youtubeUtil.getVideoIdFromYouTubeLink("LXb3E")
		}

		expect(testFunction).toThrow(TypeError);
	});

	test("throws an error when no ID is provided.", () => {
		let testFunction = () => {
			youtubeUtil.getVideoIdFromYouTubeLink("")
		}

		expect(testFunction).toThrow(TypeError);
	});
});

describe("Creating a timestamped YouTube link from an ID.", () => {
	describe("Creating a link from raw seconds. 'getTimestampVideoLinkFromSeconds()'", () => {
		it("produces a link of 'https://www.youtube.com/watch?v=LXb3EKWsInQ&t=1230' from a provided value of '1230' seconds.", () => {
			expect(youtubeUtil.getTimestampVideoLinkFromSeconds("LXb3EKWsInQ", 1230)).toEqual("https://www.youtube.com/watch?v=LXb3EKWsInQ&t=1230");
		});
		it("throws an error when negative seconds are provided of '-1230' seconds.", () => {
			let testFunction = () => {
				youtubeUtil.getTimestampVideoLinkFromSeconds("LXb3EKWsInQ", -1230);
			}

			expect(testFunction).toThrow(TypeError);
		});
		it("throws an error when no video ID is provided.", () => {
			let testFunction = () => {
				youtubeUtil.getTimestampVideoLinkFromSeconds("", 1230);
			}

			expect(testFunction).toThrow(TypeError);
		});
		it("throws an error when an invalid video ID is provided of 'LXb3EKW'.", () => {
			let testFunction = () => {
				youtubeUtil.getTimestampVideoLinkFromSeconds("LXb3EKW", 1230);
			}

			expect(testFunction).toThrow(TypeError);
		});
	});

	describe("Creating a link from a timestamp. 'getTimestampVideoLinkFromTimestamp()'", () => {
		it("produces a link of 'https://www.youtube.com/watch?v=LXb3EKWsInQ&t=1230' from a provided timestamp of '20:30'.", () => {
			expect(youtubeUtil.getTimestampVideoLinkFromTimestamp("LXb3EKWsInQ", "20:30")).toEqual("https://www.youtube.com/watch?v=LXb3EKWsInQ&t=1230");
		});
		it("throws an error when an invalid timestamp is provided of 'a:10'.", () => {
			let testFunction = () => {
				youtubeUtil.getTimestampVideoLinkFromTimestamp("LXb3EKWsInQ", "a:10");
			}

			expect(testFunction).toThrow(TypeError);
		});
		it("throws an error when no video ID is provided.", () => {
			let testFunction = () => {
				youtubeUtil.getTimestampVideoLinkFromTimestamp("", "20:30");
			}

			expect(testFunction).toThrow(TypeError);
		});
		it("throws an error when an invalid video ID is provided of 'LXb3EKW'.", () => {
			let testFunction = () => {
				youtubeUtil.getTimestampVideoLinkFromTimestamp("LXb3EKW", "20:30");
			}

			expect(testFunction).toThrow(TypeError);
		});
	});
});
