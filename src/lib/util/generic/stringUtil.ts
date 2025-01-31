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

/**
 * Returns the first index where, inserting the parameter "item" into "items" at that index, would result in the list
 * remaining sorted. Assumes that the list is already sorted via a string per item.
 * @param items The list to check "item" against.
 * @param item The item to compare.
 * @param valueAccessor Retrieves the string value for an item.
 * @returns An index of where to insert "item".
 */
export function getAlphanumericInsertIndex<T>(items: T[], item: T, valueAccessor: (item: T) => string, startIndex: number, endIndex: number): number {
	for (let i = startIndex; i < endIndex; i++) {
		if (isStringGreaterThan(valueAccessor(item), valueAccessor(items[i]))) {
			return i;
		}
	}

	return items.length;
}

/**
 * Compares two strings and determines whether one is greater than the
 * other alphanumerically. E.g. (alpha > beta) = true. (went > sent) = false.
 * @param a Left operand.
 * @param b Right operand
 * @returns Whether a is greater or equal to b alphanumerically.
 */
export function isStringGreaterThan(a: string, b: string): boolean {
	if (a == b) {
		return true;
	}

	for (let i = 0; i < Math.min(a.length, b.length); i++) {
		let aChar = a.charCodeAt(i);
		let bChar = b.charCodeAt(i);

		if (aChar < bChar) {
			return true;
		}
		else if (aChar > bChar) {
			return false;
		}
	}
  
	return true;
}
