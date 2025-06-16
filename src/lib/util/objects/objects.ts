import compare from "react-fast-compare"

// Exists so there are no random names in other files from importing fast-deep-equal.
export function areObjectsEqual(a: any, b: any): boolean {
	return compare(a, b);
}

export function deepMerge(target: any, reference: any) {
	const pass = (base: any, toMerge: any) => {
		for (let key of Object.keys(toMerge)) {
			if (base[key] == undefined) {
				base[key] = toMerge[key];
			}
		}

		for (let key of Object.keys(base)) {
            if (typeof base[key] == "object" && toMerge[key] != undefined) {
			    pass(base[key], toMerge[key]);
            }
		}
	}

	pass(target, reference);
}
