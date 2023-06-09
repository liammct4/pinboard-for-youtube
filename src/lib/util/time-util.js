export function getSecondsFromTimestamp(time) {
	let parts = time.split(":").reverse();

	let total = 0;
	let mult = [1, 60, 3600, 86400];
	
	for (let i = 0; i < parts.length; i++) {
		let num = Number(parts[i]);

		total = total + (num * mult[i]);
	}

	return total;
}

export function getTimestampFromSeconds(seconds) {
	let remaining = seconds;

	let hours = Math.floor(remaining / (60 * 60));
	remaining = remaining % (60 * 60);

	let minutes = Math.floor(remaining / 60);
	remaining = remaining % 60;

	let result = "";

	if (hours > 0) {
		result += `${hours.toString().padStart(2, "0")}:`;
	}

	result += `${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;

	return result;
}

export default getSecondsFromTimestamp;
