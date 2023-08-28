/**
 * Converts a string to title case. E.g. "This is a random phrase" -> "This Is A Random Phrase".
 * @param text The text to convert.
 * @returns A title cased version of the text.
 */
export function toTitleCase(text: string): string {
	let words = text.split(" ");

	for (let i = 0; i < words.length; i++) {
		let word = words[i];
		let newWord = word[0].toUpperCase() + word.substring(1, word.length);

		words[i] = newWord;
	}

	return words.join(" ");
}
