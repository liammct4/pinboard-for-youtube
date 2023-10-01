import { v4 as uuidv4 } from "uuid"

export type Timestamp = {
	id: string;
	time: number;
	message: string;
};

export type TagDefinition = {
	id: string;
	name: string;
	colour: string;
}

export type Video = {
	videoID: string;
	timestamps: Array<Timestamp>;
	/**
	 * Array of tag definition ids.
	 */
	appliedTags: Array<string>;
};

/**
 * Generates a new unique timestamp with a random ID. Use this to generate all timestamps.
 * @param time The timestamp time in seconds.
 * @param message The timestamp message.
 * @returns A new timestamp with a unique ID.
 */
export function generateTimestamp(time: number, message: string): Timestamp {
	return {
		id: uuidv4(),
		time: time,
		message: message
	}
}

/**
 * Clones and modifies a timestamp while still retaining the timestamp ID.
 * 
 * Set each field to null to not modify.
 * 
 * Does not modify the original timestamp object.
 * @param timestamp The timestamp to clone and modify.
 * @param time The timestamp time in seconds, set to null to keep unmodified.
 * @param message The timestamp message, set to null to keep unmodified.
 * @returns A cloned and modified timestamp.
 */
export function cloneModifyTimestamp(timestamp: Timestamp, time: number, message: string): Timestamp {
	return {
		id: timestamp.id,
		time: time ?? timestamp.time,
		message: message ?? timestamp.message
	}
}
