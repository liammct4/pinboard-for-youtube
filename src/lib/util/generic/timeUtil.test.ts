import { getTimestampFromSeconds, getSecondsFromTimestamp } from "./timeUtil.ts"

describe("Converting raw seconds to a timestamp. (E.g. '2000s' to '33:20').", () => {
	test("converts 60 seconds into one minute timestamp '01:00'.", () => {
		expect(getTimestampFromSeconds(60)).toEqual("01:00");
	});

	test("converts 2 hours (7373 seconds) into a 3 size timestamp '2:02:53'.", () => {
		expect(getTimestampFromSeconds(7373)).toEqual("2:02:53");
	});

	test("throws an error when a negative value is provided.", () => {
		let testFunction = () => {
			getTimestampFromSeconds(-3);
		}

		expect(testFunction).toThrow(TypeError);
	});	
});

describe("Converting timestamps to raw seconds (E.g. '33:20' to '2000' seconds).", () => {
	test("converts a two size timestamp (34:23) to correct number of seconds (2063).", () => {
		expect(getSecondsFromTimestamp("34:23")).toEqual(2063);
	});

	test("converts a three size timestamp (120:32:23) to correct number of seconds (433943).", () => {
		expect(getSecondsFromTimestamp("120:32:23")).toEqual(432000 + 1920 + 23);
	});

	test("throws an error when an invalid formatted value is provided (10;239a).", () => {
		let testFunction = () => {
			getSecondsFromTimestamp("10;239a");
		}

		expect(testFunction).toThrow(TypeError);
	});
});
