export function getSecondsFromTimestamp(time: string): number {
	if (!/^\s*(\d+:)?\d{2}:\d{2}\s*$/.test(time)) {
		throw new TypeError(`Invalid argument provided, the timestamp was an invalid value. Value proivded: '${time}'.`);
	}

	let parts: Array<string> = time.split(":").reverse();

	let total: number = 0;
	let mult: Array<number> = [1, 60, 3600, 86400];
	
	for (let i = 0; i < parts.length; i++) {
		let num: number = Number(parts[i]);

		total += num * mult[i];
	}

	return total;
}

export function getTimestampFromSeconds(seconds: number): string {
	if (seconds < 0) {
		throw new TypeError("Invalid argument provided, seconds was negative.");
	}

	let remaining: number = seconds;

	let hours: number = Math.floor(remaining / (60 * 60));
	remaining = remaining % (60 * 60);

	let minutes: number = Math.floor(remaining / 60);
	remaining = remaining % 60;

	let result: string = "";

	if (hours > 0) {
		result += `${hours}:`;
	}

	result += `${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;

	return result;
}
