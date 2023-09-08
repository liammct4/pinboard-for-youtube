import { convertRGBToHex, numberToHex } from "./colourUtil.ts"

describe("Converting numbers to hex. 'numberToHex()'", () => {
	it("Converts a number to hex", () => {
		let data = 100;

		expect(numberToHex(data)).toBe("64");
	});
})

describe("Converting RGB colours to hex. 'convertRGBToHex()'", () => {
	it("converts a CSS colour to hex.", () => {
		let data = "rgb(100, 200, 100)";

		expect(convertRGBToHex(data)).toBe("#64c864");
	});
	it("converts a normal set of 3 colour values to hex.", () => {
		let data = "255, 200, 100";

		expect(convertRGBToHex(data)).toBe("#ffc864");
	});
	it("returns undefined when provided with an invalid value.", () => {
		let badData = "bgr(b0,3a0)";

		expect(convertRGBToHex(badData)).toBe(undefined);
	});
});
