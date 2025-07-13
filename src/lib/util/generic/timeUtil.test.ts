import { getTimestampFromSeconds, getSecondsFromTimestamp } from "./timeUtil.ts"

describe("Converting raw seconds to a timestamp. (E.g. '2000s' to '33:20').", () => {
	test("converts 60 seconds into one minute timestamp '01:00'.", () => {
		let result = getTimestampFromSeconds(60);
		
		expect(result.success).toBe(true);
		
		if (result.success) {
			expect(result.result).toEqual("01:00");
		}
	});

	test("converts 2 hours (7373 seconds) into a 3 size timestamp '2:02:53'.", () => {
		let result = getTimestampFromSeconds(7373);

		expect(result.success).toBe(true);

		if (result.success) {	
			expect(result.result).toEqual("2:02:53");
		}
	});

	test("returns nothing when a negative value is provided.", () => {
		expect(getTimestampFromSeconds(-3).success).toBe(false);
	});	
});

describe("Converting timestamps to raw seconds (E.g. '33:20' to '2000' seconds).", () => {
	test("converts a two size timestamp (34:23) to correct number of seconds (2063).", () => {
		let result = getSecondsFromTimestamp("34:23");

		expect(result.success).toBe(true);

		if (result.success) {
			expect(result.result).toEqual(2063);
		}
	});

	test("converts a three size timestamp (120:32:23) to correct number of seconds (433943).", () => {
		let result = getSecondsFromTimestamp("120:32:23");

		expect(result.success).toBe(true);

		if (result.success) {
			expect(result.result).toEqual(432000 + 1920 + 23);
		}
	});

	test("returns no result when an invalid formatted value is provided (10;239a).", () => {
		expect(getSecondsFromTimestamp("10;239a").success).toBe(false);
	});
});
