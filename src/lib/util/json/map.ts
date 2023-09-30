/**
 * Converts an array of objects to a map based on a selector. Useful for deserialization.
 * @param items The array to convert into a map.
 * @param keySelector The accessor which returns the key of the object.
 * @returns A dictionary/map of the array with the provided selector.
 */
export function convertArrayToMap<TKey, TValue>(items: Array<TValue>, keySelector: (item: TValue) => TKey): Map<TKey, TValue> {
	let map = new Map<TKey, TValue>();
	
	for (let item of items) {
		let key: TKey = keySelector(item);

		map.set(key, item);
	}

	return map;
}
