import { toTitleCase } from "./stringUtil";

describe("Converting string casing", () => {
	describe("Converting to title case. 'toTitleCase()'", () => {
		it("converts a word to title case.", () => {
			let word: string = "working!";

			expect(toTitleCase(word)).toEqual("Working!");
		});
		it("converts a phrase to title case.", () => {
			let sentence: string = "this should be working";

			expect(toTitleCase(sentence)).toEqual("This Should Be Working");
		});
		it("does nothing to a capitalized phrase.", () => {
			let sentence: string = "THIS WILL BE WORKING";

			expect(toTitleCase(sentence)).toEqual(sentence);
		});
		it("does nothing to an existing title cased phrase.", () => {
			let sentence: string = "This Should Work";

			expect(toTitleCase(sentence)).toEqual(sentence);
		});
		it("ignores spaces and punctuation.", () => {
			let sentence: string = "this should be working!";

			expect(toTitleCase(sentence)).toEqual("This Should Be Working!");
		});
	});
});
