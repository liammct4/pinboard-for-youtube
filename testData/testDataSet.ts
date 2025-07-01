import { defaultSettings } from "../src/lib/config/settings";
import { IConfig } from "../src/lib/storage/config";
import { IVideo, generateTimestamp } from "../src/lib/video/video";
import { AppThemes, DEFAULT_THEME } from "../src/styling/themes";

/* This files contains all of the testing/sample data needed. */

export const sampleVideoData: IVideo[] = [
	{
		id: "LXb3EKWsInQ",
		timestamps: [
			generateTimestamp(63, "Timestamp expands to this end margin." ),
			generateTimestamp(4351, "Timestamp in the middle..."),
		]
	},
	{
		id: "WNCl-69POro",
		timestamps: [
			generateTimestamp(10, "A::Random"),
			generateTimestamp(20, "B::Other")
		]
	},
	{
		id: "njX2bu-_Vw4",
		timestamps: [
			generateTimestamp(230, "Sed imperdiet interdum tempus."),
			generateTimestamp(1200, "Nunc dui dolor, feugiat id eros feugiat."),
			generateTimestamp(354, "Nulla ornare arcu tellus."),
			generateTimestamp(1354, "Praesent eu nulla lacus."),
		]
	},
	{
		id: "AKeUssuu3Is",
		timestamps: [
			generateTimestamp(16, "Maecenas lectus nisl, pretium.")
		]
	},
	{
		id: "ZjVAsJOl8SM",
		timestamps: [
			generateTimestamp(1063, "Another timestamp.")
		]
	},
	{
		id: "PnvkrBXmLSI",
		timestamps: [
			generateTimestamp(60342, "Phasellus convallis arcu in malesuada mattis."),
			generateTimestamp(0, "Maximus quis purus."),
		]
	},
	{
		id: "ERYG3NE1DO8",
		timestamps: []
	}
];
