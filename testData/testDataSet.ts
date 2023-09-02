import { IConfig } from "../src/lib/storage/config/config";
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

export const sampleConfigData: IConfig = {
	theme: {
		"name": "Default",
		"palette": {
			"primary-common": "rgb(255, 30, 74)",
			"primary-faded": "rgb(255, 135, 135)",
			"primary-dark": "rgb(197, 36, 56)",
			"primary-ultradark": "rgb(146, 26, 40)",
			"empty-01-normal": "rgb(247, 228, 224)",
			"empty-01-raised": "rgb(253, 233, 229)",
			"empty-01-depth": "rgb(244, 225, 222)",
			"empty-01-shadow": "rgb(177, 165, 163)",
			"empty-02-normal": "rgb(242, 211, 197)",
			"empty-02-raised": "rgb(251, 220, 207)",
			"empty-02-depth": "rgb(209, 184, 173)",
			"empty-02-shadow": "rgb(192, 169, 159)",
			"text-strong": "rgb(15, 15, 15)",
			"text-normal": "rgb(47, 47, 47)",
			"text-light": "rgb(68, 68, 68)",
			"text-lighter": "rgb(88, 88, 88)",
			"shade-01": "rgb(40, 40, 40)",
			"shade-02": "rgb(107, 107, 107)",
			"shade-03": "rgb(136, 136, 136)",
			"shade-04": "rgb(189, 189, 189)",
			"shade-05": "rgb(230, 230, 230)",
			"shade-06": "rgb(250, 250, 250)",
			"shade-dark-01": "rgb(20, 20, 20)",
			"shade-dark-02": "rgb(43, 43, 43)",
			"shade-dark-03": "rgb(65, 65, 65)",
			"shade-light-01": "rgb(250, 250, 250)",
			"shade-light-02": "rgb(232, 232, 232)",
			"shade-light-03": "rgb(210, 210, 210)"
		}
	}
}
