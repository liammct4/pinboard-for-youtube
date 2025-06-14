import compare from "react-fast-compare"

// Exists so there are no random names in other files from importing fast-deep-equal.
export function areObjectsEqual(a: any, b: any): boolean {
	return compare(a, b);
}
