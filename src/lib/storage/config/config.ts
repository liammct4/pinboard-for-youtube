import { getNestedStorageData } from "../storage";

// TODO: Add config options.
export interface IConfig { }

export async function getUserConfig(): Promise<IConfig> {
	let config: IConfig = await getNestedStorageData("user_data/config");

	if (config == undefined) {
		throw new Error("Invalid operation, the user config data does not exist.");
	}

	return config;
}
