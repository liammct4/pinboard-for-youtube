import { Video, generateTimestamp } from "../src/lib/video/video";

/* This files contains all of the testing/sample data needed. */

export const sampleVideoData: Array<Video> = [
	{
		"videoID": "LXb3EKWsInQ",
		"timestamps": [
			generateTimestamp(63, "Timestamp expands to this end margin." ),
			generateTimestamp(4351, "Timestamp in the middle..."),
		]
	},
	{
		"videoID": "njX2bu-_Vw4",
		"timestamps": [
			generateTimestamp(230, "Sed imperdiet interdum tempus."),
			generateTimestamp(1200, "Nunc dui dolor, feugiat id eros feugiat."),
			generateTimestamp(354, "Nulla ornare arcu tellus."),
			generateTimestamp(1354, "Praesent eu nulla lacus."),
		]
	},
	{
		"videoID": "AKeUssuu3Is",
		"timestamps": [
			generateTimestamp(16, "Maecenas lectus nisl, pretium.")
		]
	},
	{
		"videoID": "ZjVAsJOl8SM",
		"timestamps": [
			generateTimestamp(1063, "Another timestamp.")
		]
	},
	{
		"videoID": "PnvkrBXmLSI",
		"timestamps": [
			generateTimestamp(60342, "Phasellus convallis arcu in malesuada mattis."),
			generateTimestamp(0, "Maximus quis purus."),
		]
	},
	{
		"videoID": "ERYG3NE1DO8",
		"timestamps": []
	}
];
