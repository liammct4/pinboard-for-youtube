export type Version = `${number}.${number}.${number}`;

export function isVersionGreater(a: Version, b: Version) {
	let aSplit = a.split(".");
	let bSplit = b.split(".");

	for (let i = 0; i < aSplit.length; i++) {
		if (Number(aSplit[i]) > Number(bSplit[i])) {
			return true;
		}
	}

	return false;
}

export function isVersionLesser(a: Version, b: Version) {
	if (a == b) {
		return false;
	}

	return !isVersionGreater(a, b);
}
