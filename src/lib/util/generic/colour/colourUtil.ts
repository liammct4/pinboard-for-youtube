/**
 * Converts a number to a string representation of its hex code.
 * @param value A number to be converted.
 * @returns A 2 character long hex code.
 */
export function numberToHex(value: number): string {
	let hex = value.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

/**
 * Converts a CSS RGB function to a hex colour code. E.g. 'rgb(20, 255, 130)' to "#14ff82"
 * @param rgb The CSS RGB colour to convert.
 * @returns A hex colour code of the input rgb.
 */
export function convertRGBToHex(rgb: string): string | undefined {
	const rgbPattern = /(?<R>\d+)[,\s]*(?<G>\d+)[,\s]*(?<B>\d+)/;

	if (!rgbPattern.test(rgb)) {
		return undefined;
	}

	const match = rgbPattern.exec(rgb);

	return "#" +
		numberToHex(Number(match!.groups!.R)) +
		numberToHex(Number(match!.groups!.G)) +
		numberToHex(Number(match!.groups!.B));
}
