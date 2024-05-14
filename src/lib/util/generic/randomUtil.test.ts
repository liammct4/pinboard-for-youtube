import { generateUniqueFrom } from "./randomUtil.ts"

describe("Generating a random value from a unique dataset. 'generateUniqueFrom()'", () => {
	it("generates an entirely unique value from an empty dataset.", () => {
		let data: number[] = [ 0 ];

		expect(generateUniqueFrom(data, x => x, 2)).toBe(1);
	});
	it("generates a value under the max limit.", () => {
		let data: number[] = [ 5, 2, 7, 3, 7, 9 ];
		let limit: number = 10;

		expect(generateUniqueFrom(data, x => x, limit)).toBeLessThan(limit);
	});
	it("returns null when no unique value can be generated.", () => {
		let data: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
		let limit: number = 10;

		expect(generateUniqueFrom(data, x => x, limit)).toBe(null);
	});
});
