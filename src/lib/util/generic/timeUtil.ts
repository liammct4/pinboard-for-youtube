export class SyncTimer {
	private _agreedTime: Date | undefined

	get agreedTime(): Date | undefined {
		return this._agreedTime;
	}

	set agreedTime(time: Date | undefined) {
		this._agreedTime = time;
	}
}

export function getSecondsFromTimestamp(time: string): ResultMessage<number> {
	/* Validates the timestamp according to the format: H:MM:SS. E.g.
	* Good cases:
	* 	1:02:03
	*	1:23:45
	*	123:45:60
	*	10:20
	* Bad cases:
	*	:12:34
	*	12:34:56:78
	*	1:2:34
	*	10:2
	*/
	if (!/^(\d+:)(\d{2}(:|$)){1,2}$/.test(time)) {
		return { success: false, reason: "The timestamp was an invalid value/could not be parsed." };
	}

	let parts: string[] = time.split(":").reverse();

	let total: number = 0;
	let mult: number[] = [1, 60, 3600, 86400];
	
	for (let i = 0; i < parts.length; i++) {
		let num: number = Number(parts[i]);

		total += num * mult[i];
	}

	return { success: true, result: total };
}

export function getTimestampFromSeconds(seconds: number): ResultMessage<string> {
	if (seconds < 0) {
		return { success: false, reason: "Seconds was negative." };
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

	return { success: true, result };
}
