/**
 * Generates a unique integer value from a dataset containing numeric values chosen by the selector argument.
 * @param dataset The dataset to base the unique value off.
 * @param selector Selects a chosen numeric value from a given item of the dataset. 
 * @param max The maximum value which the random number can be.
 * @returns A numeric value which is entirely unique to the dataset.
 */
export function generateUniqueFrom<T>(dataset: T[], selector: (x: T) => number, max: number = Number.MAX_SAFE_INTEGER): number | null {
	let isGeneratedUnique: boolean = false;
	let uniqueAvailable: boolean = false;
	
	// First check if any unique values are available.
	for (let i = 0; i < max; i++) {
		if (dataset.findIndex(x => selector(x) == i) == -1) {
			uniqueAvailable = true;
			break;
		}
	}
	
	if (!uniqueAvailable) {
		return null;
	}
	
	// Still generate random indexes because the unique value generated needs to be as random as possible.
	let next: number = 0;
	
	while (!isGeneratedUnique) {
		next = Math.floor(Math.random() * max);

		isGeneratedUnique = true;
		
		for (let item of dataset) {
			if (selector(item) == next) {
				isGeneratedUnique = false;
				break;
			}
		}
	}

	return next;
}
