import { IKeyIDItem } from "../../components/features/useUserAccount";
import { GUID } from "../util/objects/types";

export type TimestampID = `${GUID}:TIMESTAMP`;

export type Timestamp = {
	id: TimestampID;
	time: number;
	message: string;
};

export interface IVideo extends IKeyIDItem {
	timestamps: Timestamp[];
	autoplayTimestamp: TimestampID | null
};

/**
 * Generates a new unique timestamp with a random ID. Use this to generate all timestamps.
 * @param time The timestamp time in seconds.
 * @param message The timestamp message.
 * @returns A new timestamp with a unique ID.
 */
export function generateTimestamp(time: number, message: string): Timestamp {
	return {
		id: createTimestamp(),
		time: time,
		message: message
	}
}

export function createTimestamp(): TimestampID {
	return `${crypto.randomUUID()}:TIMESTAMP`;
}
