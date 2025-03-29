import { IKeyIDItem } from "../../components/features/useUserAccount";

export type Timestamp = {
	id: string;
	time: number;
	message: string;
};

export interface IVideo extends IKeyIDItem {
	timestamps: Timestamp[];
};

/**
 * Generates a new unique timestamp with a random ID. Use this to generate all timestamps.
 * @param time The timestamp time in seconds.
 * @param message The timestamp message.
 * @returns A new timestamp with a unique ID.
 */
export function generateTimestamp(time: number, message: string): Timestamp {
	return {
		id: crypto.randomUUID(),
		time: time,
		message: message
	}
}
