import * as typeUtil from "./type-util.js"

describe("Checking if a value is numeric 'isNumeric()'.", () => {
	test("returns false when an empty value is provided.", () => {
		expect(typeUtil.isNumeric("")).toBe(false);
	});
	test("returns false when nothing is provided.", () => {
		expect(typeUtil.isNumeric(null)).toBe(false);
	});
	test("returns false when a non numeric value ('a32.10') is provided.", () => {
		expect(typeUtil.isNumeric("a32.10")).toBe(false);
	});
	test("returns true when a string integer value ('17') is provided", () => {
		expect(typeUtil.isNumeric("17")).toBe(true);
	});
	test("returns true when a number integer value (17) is provided", () => {
		expect(typeUtil.isNumeric(17)).toBe(true);
	});
	test("returns true when a decimal value ('17.15') is provided", () => {
		expect(typeUtil.isNumeric(17.15)).toBe(true);
	});
})