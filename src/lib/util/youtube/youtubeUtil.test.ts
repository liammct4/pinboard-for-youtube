/**
 * @jest-environment jsdom
*/

import { getTimestampVideoLinkFromSeconds, getVideoIdFromYouTubeLink, getYouTubeLinkFromVideoID } from "./youtubeUtil";

describe("Extracting a video ID from provided link 'getVideoIdFromYouTubeLink()'", () => {
	test("extracts the video ID LXb3EKWsInQ from the link 'https://www.youtube.com/watch?v=LXb3EKWsInQ'", () => {
		let result = getVideoIdFromYouTubeLink("https://www.youtube.com/watch?v=LXb3EKWsInQ");

		expect(result.success).toBe(true);

		if (result.success) {
			expect(result.result).toEqual("LXb3EKWsInQ");
		}
	});

	test("returns no result when a link with an invalid ID is provided (Not 11 characters long) 'https://www.youtube.com/watch?v=Lb3KWnQ'", () => {
		expect(getVideoIdFromYouTubeLink("https://www.youtube.com/watch?v=Lb3KWnQ").success).toBe(false);
	});
	test("returns no result when a link with no ID is provided, 'https://www.youtube.com'", () => {
		expect(getVideoIdFromYouTubeLink("https://www.youtube.com").success).toBe(false);
	});
});

describe("Creating a YouTube URL to a specific video from a video ID. 'getYouTubeLinkFromVideoID()'", () => {
	test("creates the link 'https://www.youtube.com/watch?v=LXb3EKWsInQ' from the provided ID of 'LXb3EKWsInQ'.", () => {
		let result = getYouTubeLinkFromVideoID("LXb3EKWsInQ");
		
		expect(result.success).toBe(true);

		if (result.success) {
			expect(result.result).toEqual("https://www.youtube.com/watch?v=LXb3EKWsInQ");
		}
	});

	test("returns no result when an invalid ID is provided, 'LXb3E'.", () => {
		expect(getVideoIdFromYouTubeLink("LXb3E").success).toBe(false);
	});

	test("returns no result when no ID is provided.", () => {
		expect(getVideoIdFromYouTubeLink("").success).toBe(false);
	});
});

describe("Creating a timestamped YouTube link from an ID.", () => {
	describe("Creating a link from raw seconds. 'getTimestampVideoLinkFromSeconds()'", () => {
		it("produces a link of 'https://www.youtube.com/watch?v=LXb3EKWsInQ&t=1230' from a provided value of '1230' seconds.", () => {
			let result = getTimestampVideoLinkFromSeconds("LXb3EKWsInQ", 1230);

			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.result).toEqual("https://www.youtube.com/watch?v=LXb3EKWsInQ&t=1230");
			}
		});
		it("returns no result when negative seconds are provided of '-1230' seconds.", () => {
			expect(getTimestampVideoLinkFromSeconds("LXb3EKWsInQ", -1230).success).toBe(false);
		});
		it("returns no result when no video ID is provided.", () => {
			expect(getTimestampVideoLinkFromSeconds("", 1230).success).toBe(false);
		});
		it("returns no result when an invalid video ID is provided of 'LXb3EKW'.", () => {
			expect(getTimestampVideoLinkFromSeconds("LXb3EKW", 1230).success).toBe(false);
		});
	});
});
